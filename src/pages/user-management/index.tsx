import useSWR from 'swr'
import userService from 'src/services/users/users.service'
import { useDebounce } from 'use-debounce'
import { useState } from 'react'
import { useRouter } from 'next/router'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Card, CardHeader, Typography, CardContent, Divider, Select, MenuItem, Pagination } from '@mui/material'
import { TableUser } from 'src/views/user-management/table'
import { useUsersStore } from 'src/zustand/users'
import { AlertDelete } from 'src/views/components/alert'
import { useStateUX } from 'src/zustand/stateUX'
import toast from 'react-hot-toast'

const pathname = '/user-management'

const UserManagementPage = () => {
  const {
    users,
    setUsers,
    openDeleteUser,
    openBlockUser,
    openUnblockUser,
    setOpenBlockUser,
    setOpenDeleteUser,
    setOpenUnblockUser,
    user
  } = useUsersStore()
  const { loading, setLoading } = useStateUX()

  const router = useRouter()
  const [searchKeyInput, setSearchKeyInput] = useState('')
  const [debouncedSearchKey] = useDebounce(searchKeyInput, 800)

  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortField = searchParams.sortField?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const { data: usersData, mutate } = useSWR(
    ['/api/users/list-users', page, limit, debouncedSearchKey, sortField, sortOrder],
    () => userService.getAll(page, limit, debouncedSearchKey, sortField, sortOrder),
    { onSuccess: data => setUsers(data?.users) }
  )

  const pageCount = Math.ceil((usersData?.total || 0) / limit)

  const handlePageChange = (e: any, value: any) => {
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        page: value,
        limit: limit // giữ nguyên giá trị pageLimit
      }
    })
  }

  const handlePageLimitChange = (e: { target: { value: any } }) => {
    const newLimit = e.target.value
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        limit: newLimit,
        page: 1 // reset về page 1 khi thay đổi pageLimit
      }
    })
  }

  const onDeleteUser = async () => {
    setLoading(true)
    try {
      await userService
        .delete(user._id)
        .then(() => {
          mutate()
          setOpenDeleteUser(false)
          setLoading(false)
          toast.success('Xóa người dùng thành công')
        })
        .catch(() => {
          toast.error('Xóa người dùng thất bại')
          setLoading(false)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const onBlockUser = async () => {
    setLoading(true)
    if (!user.isBlock) {
      try {
        await userService
          .block(user._id, true)
          .then(() => {
            mutate()
            setOpenBlockUser(false)
            setLoading(false)
            toast.success('Khóa người dùng thành công')
          })
          .catch(() => {
            toast.error('Khóa người dùng thất bại')
            setLoading(false)
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onUnblockUser = async () => {
    setLoading(true)
    if (user.isBlock) {
      try {
        await userService
          .block(user._id, false)
          .then(() => {
            mutate()
            setOpenUnblockUser(false)
            setLoading(false)
            toast.success('Mở khóa người dùng thành công')
          })
          .catch(() => {
            toast.error('Mở khóa người dùng thất bại')
            setLoading(false)
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <AlertDelete
        title='Xác nhận xóa người dùng'
        content='Bạn có chắc chắn muốn xóa người dùng này không?'
        open={openDeleteUser}
        onClose={() => setOpenDeleteUser(false)}
        onSubmit={onDeleteUser}
        loading={loading}
        submitText='Xóa'
      />
      <AlertDelete
        title='Xác nhận khóa người dùng'
        content='Bạn có chắc chắn muốn khóa người dùng này không?'
        open={openBlockUser}
        onClose={() => setOpenBlockUser(false)}
        onSubmit={onBlockUser}
        loading={loading}
        submitText='Khóa'
      />
      <AlertDelete
        title='Xác nhận mở khóa người dùng'
        content='Bạn có chắc chắn muốn mở khóa người dùng này không?'
        open={openUnblockUser}
        onClose={() => setOpenUnblockUser(false)}
        onSubmit={onUnblockUser}
        loading={loading}
        submitText='Mở khóa'
      />
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Quản lý người dùng</Typography>} />
            <CardContent>
              <Grid container display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    placeholder='Tìm kiếm người dùng'
                    fullWidth
                    label='Tìm kiếm'
                    variant='outlined'
                    onChange={e => {
                      const newSearchKey = e.target.value
                      setSearchKeyInput(newSearchKey)
                      router.push({
                        pathname: pathname,
                        query: {
                          ...searchParams, // giữ các giá trị searchParams hiện tại
                          search: newSearchKey,
                          page: 1 // reset về page 1 khi thay đổi searchKey
                        }
                      })
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider sx={{ m: '0 !important' }} />
            <TableUser page={page} pageLimit={limit} data={users || []} />
            <Divider />
            <Grid
              container
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100px' }}
            >
              <Grid
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 5
                }}
              >
                <Typography mr={2} variant='body1'>
                  Số bản ghi mỗi trang:{' '}
                </Typography>
                <Select size='small' value={limit} onChange={handlePageLimitChange}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Grid>
              <Grid>
                <Pagination count={pageCount} page={page} onChange={handlePageChange} color='primary' />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

UserManagementPage.acl = {
  action: 'read',
  subject: 'user'
}
export default UserManagementPage
