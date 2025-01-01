import { Dialog, DialogTitle, DialogContent, IconButton, Button, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useForm, Controller } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import { Stack } from '@mui/system'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useState } from 'react'
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

export default function ModalAdd({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      promotionPoint: 0
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onCloseModal = () => {
    reset()
    onClose()
  }

  const onAddPacket = async (data: any) => {
    if (!isValid) return

    setIsLoading(true)
    await packetService.addPacket(
      {
        name: data.name,
        price: data.price,
        description: data.description,
        promotionPoint: data.promotionPoint,
        status: 'inactive'
      },
      () => {
        setIsLoading(false)
        toast.success('Thêm gói nạp thành công')
        onCloseModal()
        mutate('/api/packet')
      },
      error => {
        setIsLoading(false)
        toast.error(error)
      }
    )
  }

  return (
    <Dialog open={open} onClose={onCloseModal} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h2'>Thêm gói nạp</Typography>
      </DialogTitle>
      <IconButton
        sx={{
          position: 'absolute',
          right: 10,
          top: 10
        }}
        onClick={onCloseModal}
      >
        <IconifyIcon icon='tabler:x' />
      </IconButton>
      <DialogContent>
        <form onSubmit={handleSubmit(onAddPacket)}>
          <Stack spacing={3}>
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  {...field}
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
                  fullWidth
                  {...field}
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
                  fullWidth
                  {...field}
                  type='number'
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
                  fullWidth
                  {...field}
                  label='Mô tả'
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Stack>
          <Stack direction='row' justifyContent='flex-end' spacing={2} mt={3}>
            <Button variant='outlined' type='button' onClick={onCloseModal}>
              Hủy
            </Button>
            <LoadingButton variant='contained' type='submit' loading={isLoading} disabled={!isValid}>
              Thêm
            </LoadingButton>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
