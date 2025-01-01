import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  MenuItem
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import productService from 'src/services/product/product.service'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { useProductStore } from 'src/zustand/product'
import { useStateUX } from 'src/zustand/stateUX'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useEffect } from 'react'
import { Product } from 'src/types/product/productType'

interface approveForm {
  productId: string
  approveStatus: 'pending' | 'approved' | 'rejected'
  description: string
}

const defaultValues: approveForm = {
  productId: '',
  approveStatus: '' as 'pending' | 'approved' | 'rejected',
  description: ''
}

const approveSchema = yup.object().shape({
  description: yup.string().max(255, 'Mô tả không được vượt quá 255 ký tự').optional(),
  approveStatus: yup.string().required('Trạng thái không được để trống')
})

export const ApproveModal = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const limit = Number(router.query.limit) || 10
  const searchKey = (router.query.search as string) || ''
  const sortField = router.query.sortField?.toString() || ''
  const sortOrder = router.query.sortOrder?.toString() || ''

  const { openApproveProduct, setOpenApproveProduct, product, setProduct } = useProductStore()
  const { setLoading, loading } = useStateUX()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(approveSchema)
  })

  useEffect(() => {
    if (product) {
      reset({
        approveStatus: product.approved?.approveStatus || ''
      })
    }
  }, [reset, product])

  const onClose = () => {
    setOpenApproveProduct(false)
    reset(defaultValues)
    setProduct({} as Product)
  }

  const onSubmit = async (data: approveForm) => {
    setLoading(true)
    try {
      await productService
        .approve(product._id, data)
        .then(() => {
          toast.success('Sản phẩm đã được duyệt')
          mutate(['productClient', page, limit, searchKey, sortField, sortOrder])
          onClose()
        })
        .catch(() => {
          toast.error('Duyệt sản phẩm thất bại')
        })
    } catch (error) {
      toast.error('Duyệt sản phẩm thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog fullWidth open={openApproveProduct} onClose={onClose}>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Typography variant='h2'>Duyệt sản phẩm</Typography>
          </DialogTitle>
          <IconButton
            onClick={onClose}
            sx={theme => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500]
            })}
          >
            <Icon icon='material-symbols:close' />
          </IconButton>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='approveStatus'
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      label='Trạng thái'
                      variant='outlined'
                      defaultValue={product.approved?.approveStatus}
                      error={errors.approveStatus ? true : false}
                      helperText={errors.approveStatus ? errors.approveStatus.message : ''}
                    >
                      <MenuItem value='pending'>Chờ duyệt</MenuItem>
                      <MenuItem value='approved'>Duyệt</MenuItem>
                      <MenuItem value='rejected'>Từ chối</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='description'
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Mô tả'
                      fullWidth
                      multiline
                      rows={4}
                      error={errors.description ? true : false}
                      helperText={errors.description ? errors.description.message : ''}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant='outlined'>
              Hủy
            </Button>
            <LoadingButton loading={loading} variant='contained' type='submit' color='primary'>
              Lưu
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
