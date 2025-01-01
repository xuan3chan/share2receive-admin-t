import { Dialog, DialogContent, DialogTitle, IconButton, Button, Grid, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEvidenceStore } from 'src/zustand/evidence'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import IconifyIcon from 'src/@core/components/icon'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getFileExtension } from 'src/helpers'
import { styled } from '@mui/system'
import { LoadingButton } from '@mui/lab'
import { mutate } from 'swr'
import evidenceService from 'src/services/evidence/evidence.service'
import toast from 'react-hot-toast'

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

export default function Update({ filterValue }: { filterValue: string }) {
  const { openUpdate, toggleOpenUpdate, evidenceId } = useEvidenceStore()
  const [file, setFile] = useState<File | null>(null)
  const [fileExtension, setFileExtension] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = router.query
  const page = searchParams.page ? Number(searchParams.page) : 1
  const limit = searchParams.limit ? Number(searchParams.limit) : 10
  const filterBy = searchParams.filterBy?.toString() || 'type'
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const defaultValues = {
    type: '',
    file: null as File | null
  }

  const schema = yup.object().shape({
    type: yup.string().required('Loại tệp là bắt buộc'),
    file: yup.mixed().nullable().required('Bạn cần phải truyền tệp')
  })

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    reset,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('file', file, { shouldValidate: true })
      setFile(file)
      setFileExtension(getFileExtension(file?.name || ''))
    }
  }

  const onClose = () => {
    toggleOpenUpdate()
    setFile(null)
    setFileExtension(null)
    reset({
      type: '',
      file: null
    })
  }

  const onSubmit = async () => {
    try {
      if (!file || !evidenceId) return

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', getValues('type'))

      await evidenceService.editEvidence(
        evidenceId,
        formData,
        () => {
          toast.success('Cập nhật tệp thành công')
          onClose()
          mutate(['/api/evidence', page, limit, filterBy, filterValue, sortBy, sortOrder])
        },
        error => {
          console.error('Lỗi khi cập nhật:', error)
          toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật tệp')
        }
      )
    } catch (error) {
      console.error('Lỗi không mong muốn:', error)
      toast.error('Có lỗi xảy ra khi cập nhật tệp')
    }
  }

  return (
    <>
      <Dialog open={openUpdate} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle>
          <Typography variant='h3'>Cập nhật</Typography>
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
          <IconifyIcon icon='tabler:x' />
        </IconButton>
        <DialogContent>
          <Typography sx={{ mb: 2, color: '#a31f15' }} variant='h6' display='flex' alignItems='center' gap={1}>
            *Nếu như thay đổi tệp trước đó sẽ không thể phục hồi lại
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='type'
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      value={value}
                      onChange={onChange}
                      label='Loại tệp'
                      select
                      fullWidth
                      placeholder='Chọn loại tệp'
                      error={Boolean(errors.type)}
                      {...(errors.type && { helperText: errors.type.message })}
                    >
                      <MenuItem value=''>Chọn loại tệp</MenuItem>
                      <MenuItem value='fileEvidence'>Tệp minh chứng</MenuItem>
                      <MenuItem value='fileExport'>Tệp đối soát</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Controller
                  name='file'
                  control={control}
                  render={({}) => (
                    <>
                      <Button
                        component='label'
                        variant='contained'
                        startIcon={<IconifyIcon icon='material-symbols:cloud-upload' />}
                      >
                        Đăng tải tệp
                        <VisuallyHiddenInput
                          accept='.xlsx, .xls, .docx, .doc'
                          type='file'
                          onChange={handleChangeFile}
                        />
                      </Button>
                      {(fileExtension === 'xlsx' || fileExtension === 'xls') && (
                        <IconifyIcon icon='vscode-icons:file-type-excel' />
                      )}
                      {(fileExtension === 'docx' || fileExtension === 'doc') && (
                        <IconifyIcon icon='vscode-icons:file-type-word' />
                      )}
                      {file && <Typography>{file.name}</Typography>}
                      {Boolean(errors.file) && <Typography color='error'>{errors.file?.message}</Typography>}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} variant='outlined' sx={{ mr: 2 }}>
                  Hủy
                </Button>
                <LoadingButton type='submit' variant='contained' color='primary' disabled={!isValid}>
                  Cập nhật
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
