import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { useAdminStore } from 'src/zustand/admin'
import { useStateUX } from 'src/zustand/stateUX'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateAdminSchema } from 'src/validations/admin/adminSchema'
import adminService from 'src/services/admin/admin.service'
import { ChangeEvent, useEffect, useState } from 'react'
import { Admin } from 'src/types/admin/adminTypes'

interface updateAdminForm {
  _id: string
  adminName: string
  accountName: string
  password: string
  confirmPassword: string
  roleId: string
  showUpdatePassword: boolean
}

const defaultValues: updateAdminForm = {
  _id: '',
  adminName: '',
  accountName: '',
  password: '',
  confirmPassword: '',
  roleId: '',
  showUpdatePassword: false
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export const UpdateAdminModal = () => {
  const [checked, setChecked] = useState<boolean>(false)
  const [isUpdatePasswordVisibleState, setIsUpdatePasswordVisibleState] = useState<boolean>(false)
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const pageLimit = Number(router.query.limit) || 10
  const searchKey = (router.query.search as string) || ''

  const { openEditAdminModal, setOpenEditAdminModal, roles, admin, setAdmin } = useAdminStore()
  const { setLoading, loading } = useStateUX()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid }
  } = useForm<updateAdminForm>({
    defaultValues: {
      ...defaultValues,
      showUpdatePassword: false // Add default value for the condition
    },
    resolver: yupResolver(updateAdminSchema),
    mode: 'onBlur'
  })

  useEffect(() => {
    if (admin) {
      reset({
        _id: admin._id,
        accountName: admin.accountName,
        adminName: admin.adminName,
        roleId: admin.role?._id
      })
    }
  }, [admin, reset])

  const onClose = () => {
    setOpenEditAdminModal(false)
    reset(defaultValues)
    setChecked(false)
    setAdmin({} as Admin)
    setIsUpdatePasswordVisibleState(false)
  }

  const onSubmit = async (data: updateAdminForm) => {
    setLoading(true)
    try {
      await adminService.update(data._id, data)
      mutate(['/api/admin', page, pageLimit, searchKey])
      toast.success('Cập nhật quản trị viên thành công')
      onClose()
    } catch {
      setError('accountName', { type: 'manual', message: 'Tài khoản đã tồn tại' })
      toast.error('Cập nhật quản trị viên thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeShowPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const handleChangeShowUpdatePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setIsUpdatePasswordVisibleState(event.target.checked)
  }

  return (
    <Dialog open={openEditAdminModal} onClose={onClose} fullWidth>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h2'>Cập nhật tài khoản quản trị viên</Typography>
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
                name='accountName'
                rules={{ required: 'Tên tài khoản không được để trống' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Tên tài khoản'
                    fullWidth
                    error={!!errors.accountName}
                    helperText={errors.accountName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='adminName'
                rules={{ required: 'Tên quản trị viên không được để trống' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Tên quản trị viên'
                    fullWidth
                    error={!!errors.adminName}
                    helperText={errors.adminName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label='Cập nhật mật khẩu'
                control={
                  <Checkbox
                    checked={isUpdatePasswordVisibleState}
                    onChange={handleChangeShowUpdatePassword}
                    name='showPassword'
                  />
                }
              />
            </Grid>
            {isUpdatePasswordVisibleState && (
              <>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name='password'
                    rules={{ required: 'Mật khẩu không được để trống' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        label='Mật khẩu'
                        fullWidth
                        type={checked ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name='confirmPassword'
                    rules={{ required: 'Xác nhận mật khẩu không được để trống' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        label='Nhập lại mật khẩu'
                        fullWidth
                        type={checked ? 'text' : 'password'}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    label='Hiển thị mật khẩu'
                    control={<Checkbox checked={checked} onChange={handleChangeShowPassword} name='showPassword' />}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Controller
                control={control}
                name='roleId'
                rules={{ required: 'Vai trò không được để trống' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    error={!!errors.roleId}
                    helperText={errors.roleId?.message}
                    SelectProps={{
                      multiple: false,
                      MenuProps: MenuProps
                    }}
                    label='Vai trò'
                    fullWidth
                    placeholder='Chọn vai trò'
                  >
                    {roles.map(role => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
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
