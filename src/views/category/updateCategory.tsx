import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  MenuItem
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useStateUX } from 'src/zustand/stateUX'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Category, CategoryCreate, CategoryUpdate } from 'src/types/category/categoryTypes'
import { useCategoryStore } from 'src/zustand/category'
import { updateCategorySchema } from 'src/validations/category/categorySchema'
import toast from 'react-hot-toast'
import { ChangeEvent, useEffect, useState } from 'react'
import axiosUpload from 'src/lib/axiosUpload'

const defaultValues: CategoryCreate = {
  name: '',
  description: '',
  priority: '' as 'medium' | 'veryHigh' | 'high' | 'low',
  status: 'active',
  imgUrl: '',
  type: ''
}

export const UpdateCategoryModal = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const pageLimit = Number(router.query.limit) || 10
  const searchKey = (router.query.search as string) || ''
  const sortField = (router.query.sortField as string) || ''
  const sortOrder = (router.query.sortOrder as string) || ''
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { openUpdateCategory, setOpenUpdateCategory, category, setCategory } = useCategoryStore()
  const { setLoading, loading } = useStateUX()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    reset
  } = useForm<CategoryCreate>({
    resolver: yupResolver(updateCategorySchema),
    mode: 'onBlur'
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'active',
        type: category.type || '',
        priority: (category.priority as 'medium' | 'veryHigh' | 'high' | 'low') || ''
      })
    }
  }, [reset, category])

  const handleChangePreviewImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    setFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImg(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const onClose = () => {
    setOpenUpdateCategory(false)
    setPreviewImg(null)
    setFile(null)
    reset(defaultValues)
    setCategory({} as Category)
  }

  const onSubmit = async (data: CategoryUpdate) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('status', data.status)
    formData.append('type', data.type)
    formData.append('priority', data.priority)
    if (file) {
      formData.append('imgUrl', file)
    }
    setLoading(true)
    try {
      const res = await axiosUpload.put(`/api/category/${category._id}`, formData)
      console.log(res.data)
      mutate(['/api/category', page, pageLimit, searchKey, sortField, sortOrder])
      toast.success('Cập nhật danh mục thành công')
      onClose()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError('name', {
        type: 'manual',
        message: 'Tên danh mục đã tồn tại'
      })
      setLoading(false)
    }
  }

  return (
    <Dialog open={openUpdateCategory} onClose={onClose} fullWidth>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h2'>Cập nhật danh mục</Typography>
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
          <Icon icon={'material-symbols:close'} />
        </IconButton>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='name'
                rules={{ required: 'Tên danh mục không được để trống' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Tên danh mục'
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='description'
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    multiline
                    rows={6}
                    label='Mô tả danh mục'
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='type'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    label='Loại danh mục'
                    fullWidth
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    placeholder='Chọn loại danh mục'
                  >
                    <MenuItem value='' disabled>
                      Chọn loại danh mục
                    </MenuItem>
                    <MenuItem value='male'>Đồ nam</MenuItem>
                    <MenuItem value='female'>Đồ nữ</MenuItem>
                    <MenuItem value='unisex'>Unisex</MenuItem>
                    <MenuItem value='item'>Đồ dùng</MenuItem>
                    <MenuItem value='other'>Khác</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='priority'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    label='Độ ưu tiên'
                    fullWidth
                    defaultValue={category.priority}
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    placeholder='Chọn độ ưu tiên'
                  >
                    <MenuItem disabled value=''>
                      ----Chọn mức độ ưu tiên----
                    </MenuItem>
                    <MenuItem value='veryHigh'>Rất cao</MenuItem>
                    <MenuItem value='high'>Cao</MenuItem>
                    <MenuItem value='medium'>Trung bình</MenuItem>
                    <MenuItem value='low'>Thấp</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item>
              <Controller
                control={control}
                name='status'
                render={({ field }) => (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value === 'active'}
                          defaultChecked={field.value === 'active'}
                          onChange={event => field.onChange(event.target.checked ? 'active' : 'inactive')}
                        />
                      }
                      label='Trạng thái'
                    />
                  </FormGroup>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {(typeof previewImg === 'string' || category.imgUrl) && (
                <img src={(previewImg as string) || category.imgUrl} alt='preview' width='100' />
              )}
            </Grid>
            <Grid item xs={12}>
              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='raised-button-file'
                type='file'
                onChange={handleChangePreviewImg}
              />
              <label htmlFor='raised-button-file'>
                <Button variant='contained' component='span'>
                  Chọn ảnh
                </Button>
              </label>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' type='reset' onClick={onClose} color='error'>
            Hủy
          </Button>
          <LoadingButton
            loading={loading}
            type='submit'
            variant='contained'
            color='primary'
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
