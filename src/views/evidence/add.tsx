import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useEvidenceStore } from 'src/zustand/evidence'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { getFileExtension } from 'src/helpers'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { LoadingButton } from '@mui/lab'
import evidenceService from 'src/services/evidence/evidence.service'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
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

export default function Add({ type, filterValue }: { type: string; filterValue: string }) {
  const { openAdd, toggleOpenAdd } = useEvidenceStore()
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
    file: null as File | null,
    description: ''
  }

  const schema = yup.object().shape({
    file: yup.mixed().nullable().required('Bạn cần phải truyền tệp'),
    description: yup.string().optional().max(255, 'Mô tả không được quá 255 ký tự')
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
      setValue('file', file)
      setFile(file)
      setFileExtension(getFileExtension(file?.name || ''))
    }
  }

  const onClose = () => {
    setFile(null)
    setFileExtension(null)
    toggleOpenAdd()
    reset(defaultValues)
  }

  const onSubmit = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', getValues('description'))
    formData.append('type', type)

    await evidenceService.addEvidence(
      formData,
      () => {
        toast.success('Thêm đối soát thành công')
        onClose()
        mutate(['/api/evidence', page, limit, filterBy, filterValue, sortBy, sortOrder])
      },
      error => {
        toast.error(error)
      }
    )
  }

  return (
    <>
      <Dialog open={openAdd} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle>
          <Typography variant='h2'>Thêm đối soát</Typography>
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
          <IconifyIcon icon='material-symbols:close' />
        </IconButton>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
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
                          multiple
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
              <Grid item xs={12}>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      label='Mô tả'
                      fullWidth
                      value={value}
                      onChange={onChange}
                      multiline
                      rows={3}
                      error={Boolean(errors.description)}
                      placeholder='Mô tả'
                      {...(errors.description && { helperText: errors.description.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} variant='outlined' sx={{ mr: 2 }}>
                  Hủy
                </Button>
                <LoadingButton type='submit' variant='contained' color='primary' disabled={!isValid}>
                  Thêm mới
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
