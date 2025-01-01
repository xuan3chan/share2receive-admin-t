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
import { addRoleSchema } from 'src/validations/role/roleSchema'
import permissions from '../../lib/permission.json'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import roleService from 'src/services/role/role.service'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'

interface addRoleForm {
  name: string
  permissionID: number[]
}

const defaultValues: addRoleForm = {
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

export const AddRoleModal = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const pageLimit = Number(router.query.limit) || 10
  const searchKey = (router.query.search as string) || ''

  const { openAddRoleModal, setOpenAddRoleModal } = useRoleStore()
  const { setLoading, loading } = useStateUX()
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<addRoleForm>({
    resolver: yupResolver(addRoleSchema),
    mode: 'onBlur'
  })

  const onClose = () => {
    setOpenAddRoleModal(false)
    reset(defaultValues)
  }

  const onSubmit = async (data: addRoleForm) => {
    setLoading(true)
    try {
      await roleService
        .add(data)
        .then(() => {
          mutate(['/api/role', page, pageLimit, searchKey])
          toast.success('Thêm vai trò thành công')
          onClose()
          setLoading(false)
        })
        .catch(() => {
          toast.error('Thêm vai trò thất bại')
          setLoading(false)
          setError('name', { type: 'manual', message: 'Tên vai trò đã tồn tại' })
        })
    } catch (error: any) {
      setError('name', { type: 'manual', message: 'Tên vai trò đã tồn tại' })
    }
  }

  return (
    <Dialog open={openAddRoleModal} onClose={onClose} fullWidth>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h2'>Thêm vai trò</Typography>
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
                        if ((selected as number[])?.length === 0) {
                          return <Typography color='textSecondary'>Chọn quyền hạn</Typography>
                        }

                        return (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(selected as number[]).map(id => {
                              const permission = permissions.find(permission => permission.id === id)

                              return (
                                <Chip
                                  key={id}
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
