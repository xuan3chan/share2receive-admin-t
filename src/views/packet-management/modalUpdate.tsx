import { Dialog, DialogTitle, DialogContent, IconButton, Button, Typography, Stack, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconifyIcon from 'src/@core/components/icon'
import { Packet } from 'src/types/packet/packetType'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useEffect, useState } from 'react'
import packetService from 'src/services/packet/packet.service'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

const schema = yup.object({
  name: yup.string().required('Tên gói nạp là bắt buộc').max(255, 'Tên gói nạp không được quá 255 ký tự'),
  price: yup.number().typeError('Giá phải là số').min(1000, 'Giá phải lớn hơn 1000').required('Giá là bắt buộc'),
  description: yup.string().max(255, 'Mô tả không được quá 255 ký tự').optional(),
  promotionPoint: yup
    .number()
    .typeError('Số điểm khuyến mãi phải là số')
    .min(1, 'Số điểm khuyến mãi phải lớn hơn 1')
    .required('Số điểm khuyến mãi là bắt buộc')
})

export default function ModalUpdate({
  open,
  onClose,
  packet
}: {
  open: boolean
  onClose: () => void
  packet: Packet | null
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      name: packet?.name,
      price: packet?.price,
      promotionPoint: packet?.promotionPoint,
      description: packet?.description
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset({
      name: packet?.name,
      price: packet?.price,
      promotionPoint: packet?.promotionPoint,
      description: packet?.description
    })
  }, [packet])

  const onCloseModal = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: any) => {
    if (!isValid || !packet) return

    const newData = {
      name: data.name,
      price: data.price,
      promotionPoint: data.promotionPoint,
      description: data.description
    }

    setIsLoading(true)
    await packetService.updatePacket(
      packet?._id,
      newData,
      () => {
        onCloseModal()
        setIsLoading(false)
        toast.success('Cập nhật gói nạp thành công', {
          position: 'top-center'
        })
        mutate('/api/packet')
      },
      error => {
        setIsLoading(false)
        toast.error(error, {
          position: 'top-center'
        })
      }
    )
  }

  return (
    <Dialog open={open} onClose={onCloseModal} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h2'>Cập nhật gói nạp</Typography>
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10
        }}
      >
        <IconifyIcon icon='mdi:close' />
      </IconButton>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2}>
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Tên gói nạp'
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='price'
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='number'
                  label='Giá'
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='promotionPoint'
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Số điểm khuyến mãi'
                  error={!!errors.promotionPoint}
                  helperText={errors.promotionPoint?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='description'
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label='Mô tả'
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Stack>
          <Grid container justifyContent='flex-end' mt={4} gap={2}>
            <Button onClick={onCloseModal} variant='outlined'>
              Hủy
            </Button>
            <LoadingButton loading={isLoading} type='submit' variant='contained' color='primary' disabled={!isValid}>
              Cập nhật
            </LoadingButton>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
