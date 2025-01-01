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
import { CategoryCreate } from 'src/types/category/categoryTypes'
import { useCategoryStore } from 'src/zustand/category'
import { addCategorySchema } from 'src/validations/category/categorySchema'
import toast from 'react-hot-toast'
import { ChangeEvent, useState } from 'react'
import axiosUpload from 'src/lib/axiosUpload'

const defaultValues: CategoryCreate = {
  name: '',
  description: '',
  priority: '' as 'medium' | 'veryHigh' | 'high' | 'low',
  status: 'active',
  type: '',
  imgUrl: ''
}

export const AddCategoryModal = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const pageLimit = Number(router.query.limit) || 10
  const searchKey = (router.query.search as string) || ''
  const sortField = (router.query.sortField as string) || ''
  const sortOrder = (router.query.sortOrder as string) || ''

  const { openCreateCategory, setOpenCreateCategory } = useCategoryStore()
  const { setLoading, loading } = useStateUX()
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<CategoryCreate>({
    resolver: yupResolver(addCategorySchema),
    mode: 'onBlur',
    defaultValues: {
      status: 'active'
    }
  })

  const handleChangePreviewImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      // Kiểm tra kích thước file
      if (file.size > 5 * 1024 * 1024) {
        setError('imgUrl', {
          type: 'manual',
          message: 'Kích thước ảnh không được vượt quá 5MB'
        })
        setFile(null)
        setPreviewImg(null)

        return
      }

      // Kiểm tra định dạng file
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        setError('imgUrl', {
          type: 'manual',
          message: 'Chỉ chấp nhận định dạng ảnh: jpg, jpeg, png'
        })
        setFile(null)
        setPreviewImg(null)

        return
      }

      setFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImg(reader.result)
      }
      reader.readAsDataURL(file)
      clearErrors('imgUrl') // Xóa lỗi khi file hợp lệ
    }
  }

  const onClose = () => {
    setOpenCreateCategory(false)
    setPreviewImg(null)
    setFile(null)
    reset(defaultValues)
    clearErrors() // Xóa tất cả lỗi khi đóng modal
  }

  const onSubmit = async (data: CategoryCreate) => {
    if (!file) {
      setError('imgUrl', {
        type: 'manual',
        message: 'Vui lòng chọn hình ảnh'
      })

      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('status', data.status)
    formData.append('type', data.type)
    formData.append('priority', data.priority)
    formData.append('imgUrl', file)

    try {
      const res = await axiosUpload.post('/api/category', formData)
      console.log(res.data)
      mutate(['/api/category', page, pageLimit, searchKey, sortField, sortOrder])
      toast.success('Thêm danh mục thành công')
      onClose()
      setLoading(false)
    } catch (error) {
      setError('name', {
        type: 'manual',
        message: 'Tên danh mục này đã tồn tại'
      })
      setLoading(false)
    }
  }

  return (
    <Dialog open={openCreateCategory} onClose={onClose} fullWidth>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h2'>Thêm danh mục</Typography>
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
                    defaultValue=''
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
                    label='Ưu tiên'
                    fullWidth
                    defaultValue=''
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    placeholder='Chọn ưu tiên'
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
              {previewImg && <img src={previewImg as string} alt='preview' width='100' />}
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='imgUrl'
                rules={{
                  required: 'Vui lòng chọn hình ảnh',
                  validate: () => {
                    if (!file) return 'Vui lòng chọn hình ảnh'

                    return true
                  }
                }}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      accept='image/jpeg,image/png,image/jpg'
                      style={{ display: 'none' }}
                      id='raised-button-file'
                      type='file'
                      onChange={e => {
                        field.onChange(e)
                        handleChangePreviewImg(e)
                      }}
                    />
                    <label htmlFor='raised-button-file'>
                      <Button variant='contained' component='span' color={errors.imgUrl ? 'error' : 'primary'}>
                        Chọn ảnh
                      </Button>
                    </label>
                    {errors.imgUrl && (
                      <Typography color='error' variant='caption' sx={{ display: 'block', mt: 1 }}>
                        {errors.imgUrl.message}
                      </Typography>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' color='textSecondary'>
                Định dạng ảnh: jpg, jpeg, png
              </Typography>
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
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
