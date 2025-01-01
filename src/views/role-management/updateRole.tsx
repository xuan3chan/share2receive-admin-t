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
  Chip
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useRoleStore } from 'src/zustand/roles'
import { useStateUX } from 'src/zustand/stateUX'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateRoleSchema } from 'src/validations/role/roleSchema'
import permissions from '../../lib/permission.json'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import roleService from 'src/services/role/role.service'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { Roles } from 'src/types/role/roleType'
import { useEffect } from 'react'

interface updateRoleForm {
  _id: string
  name: string
  permissionID: number[]
}

const defaultValues: updateRoleForm = {
  _id: '',
  name: '',
  permissionID: []
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

export const UpdateRoleModal = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const pageLimit = Number(router.query.limit) || 10
  const searchKey = (router.query.search as string) || ''

  const { setOpenEditRoleModal, openEditRoleModal, role, setRole } = useRoleStore()
  const { setLoading, loading } = useStateUX()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<updateRoleForm>({
    defaultValues,
    resolver: yupResolver(updateRoleSchema),
    mode: 'onBlur'
  })

  // Cập nhật giá trị mặc định khi role thay đổi
  useEffect(() => {
    if (role) {
      reset({
        _id: role._id || '',
        name: role.name || '',
        permissionID: role.permissionID || []
      })
    }
  }, [role, reset])

  const onClose = () => {
    setOpenEditRoleModal(false)
    setRole({} as Roles)
    reset(defaultValues)
  }

  const onSubmit = async (data: updateRoleForm) => {
    setLoading(true)
    try {
      await roleService
        .update(data)
        .then(() => {
          mutate(['/api/role', page, pageLimit, searchKey])
          toast.success('Cập nhật vai trò thành công')
          onClose()
          setLoading(false)
        })
        .catch(() => {
          toast.error('Cập nhật vai trò thất bại')
          setLoading(false)
          setError('name', { type: 'manual', message: 'Tên vai trò đã tồn tại' })
        })
    } catch (error: any) {
      setError('name', { type: 'manual', message: 'Tên vai trò đã tồn tại' })
    }
  }

  return (
    <Dialog open={openEditRoleModal} onClose={onClose} fullWidth>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h2'>Sửa vai trò</Typography>
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
                name='name'
                rules={{ required: 'Tên vai trò không được để trống' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Tên vai trò'
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
                name='permissionID'
                rules={{ required: 'Quyền hạn không được để trống' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    error={!!errors.permissionID}
                    helperText={errors.permissionID?.message}
                    SelectProps={{
                      multiple: true,
                      MenuProps: MenuProps,
                      renderValue: selected => {
                        return (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(selected as number[]).map(value => {
                              const permission = permissions.find(permission => permission.id === value)

                              return (
                                <Chip
                                  key={permission?.id}
                                  label={permission?.namePermission}
                                  style={{
                                    margin: 2,
                                    backgroundColor: `${permission?.color.action_color}2D`
                                  }}
                                />
                              )
                            })}
                          </div>
                        )
                      }
                    }}
                    value={field.value || []}
                    label='Chọn quyền hạn'
                    fullWidth
                    placeholder='Chọn quyền hạn'
                  >
                    {permissions.map(permission => (
                      <MenuItem key={permission.id} value={permission.id}>
                        {permission.namePermission}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} type='reset' variant='outlined' onClick={onClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
