import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Stack, Grid, Button } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { Packet } from 'src/types/packet/packetType'
import { ChangeEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { styled } from '@mui/system'
import Image from 'next/image'
import packetService from 'src/services/packet/packet.service'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const schema = yup.object().shape({
  image: yup.mixed().nullable().required('Bạn cần phải truyền tệp')
})

export default function ModalAddImage({
  open,
  onClose,
  packet
}: {
  open: boolean
  onClose: () => void
  packet: Packet | null
}) {
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      image: null as File | null
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onCloseModal = () => {
    reset()
    setPreviewImage(null)
    onClose()
  }

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const reader = new FileReader()

    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }

    if (file) {
      setImage(file)
      reader.readAsDataURL(file)
      setValue('image', file, { shouldValidate: true })
    }
  }

  const onSubmit = async () => {
    if (!image || !packet) return

    const formData = new FormData()
    formData.append('file', image)

    setLoading(true)
    await packetService.uploadImage(
      packet?._id,
      formData,
      () => {
        toast.success('Thêm ảnh thành công')
        mutate('/api/packet')
        onCloseModal()
        setLoading(false)
      },
      error => {
        toast.error(error)
        setLoading(false)
      }
    )
  }

  return (
    <Dialog open={open} onClose={onCloseModal} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h2'>Thêm ảnh</Typography>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={onCloseModal}
        >
          <IconifyIcon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='image'
            control={control}
            render={({}) => (
              <>
                <Button
                  component='label'
                  variant='contained'
                  startIcon={<IconifyIcon icon='material-symbols:cloud-upload' />}
                >
                  Đăng tải tệp
                  <VisuallyHiddenInput accept='image/*' type='file' onChange={handleChangeFile} />
                </Button>

                {Boolean(errors.image) && <Typography color='error'>{errors.image?.message}</Typography>}
              </>
            )}
          />
          {previewImage && (
            <div style={{ marginTop: 16, width: '70%' }}>
              <Image
                src={previewImage}
                alt='preview'
                width={100}
                height={100}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}
          <Grid container sx={{ marginTop: 4 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Stack direction='row' spacing={2}>
                <Button variant='outlined' type='button' onClick={onCloseModal}>
                  Hủy
                </Button>
                <LoadingButton loading={loading} type='submit' variant='contained' disabled={!isValid}>
                  Lưu
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}
