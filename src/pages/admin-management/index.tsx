import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Pagination,
  Typography,
  Select,
  MenuItem,
  Button
} from '@mui/material'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useStateUX } from 'src/zustand/stateUX'
import { AlertDelete } from 'src/views/components/alert'
import { useAdminStore } from 'src/zustand/admin'
import adminService from 'src/services/admin/admin.service'
import roleService from 'src/services/role/role.service'
import CustomTextField from 'src/@core/components/mui/text-field'
import TableAdmins from 'src/views/admin-management/table'
import { useEffect } from 'react'
import { AddAdminModal } from 'src/views/admin-management/addAdmin'
import { UpdateAdminModal } from 'src/views/admin-management/updateAdmin'
import { useDebounce } from 'use-debounce'
import { useState } from 'react'

const AdminPage = () => {
  const {
    admins,
    setAdmins,
    setOpenAddAdminModal,
    setRoles,
    setOpenDeleteAdminModal,
    openDeleteAdminModal,
    admin,
    openBlockAdminModal,
    openUnblockAdminModal,
    setOpenBlockAdminModal,
    setOpenUnblockAdminModal
  } = useAdminStore()
  const { setLoading, loading } = useStateUX()
  const [searchKeyInput, setSearchKeyInput] = useState('')
  const [debouncedSearchKey] = useDebounce(searchKeyInput, 800)

  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const pageLimit = Number(searchParams.limit) || 10

  const { data: adminData, mutate } = useSWR(
    ['/api/admin', page, pageLimit, debouncedSearchKey],
    () => adminService.getAll(page, pageLimit, debouncedSearchKey),
    { onSuccess: data => setAdmins(data?.admins) }
  )

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await roleService.getAll(1, 9999, '')
        setRoles(roles.roles)
      } catch (error) {
        console.log(error)
      }
    }
    fetchRoles()
  }, [])

  const pageCount = Math.ceil((adminData?.total || 0) / pageLimit)

  const handlePageLimitChange = (e: { target: { value: any } }) => {
    const newLimit = e.target.value
    router.push({
      pathname: '/admin-management',
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        limit: newLimit,
        page: 1 // reset về page 1 khi thay đổi pageLimit
      }
    })
  }

  const handlePageChange = (e: any, value: any) => {
    router.push({
      pathname: '/admin-management',
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        page: value,
        limit: pageLimit // giữ nguyên giá trị pageLimit
      }
    })
  }

  const onDelete = async () => {
    setLoading(true)
    try {
      await adminService.delete(admin._id)
      setOpenDeleteAdminModal(false)
      mutate()
      toast.success('Xóa tài khoản thành công')
    } catch {
      toast.error('Xóa tài khoản thất bại')
    } finally {
      setLoading(false)
      setOpenDeleteAdminModal(false)
    }
  }

  const onUnBlock = async () => {
    setLoading(true)
    if (admin.isBlock) {
      try {
        await adminService.block(admin._id, false)
        mutate()
        setOpenUnblockAdminModal(false)
        setLoading(false)
        toast.success('Mở khóa tài khoản thành công')
      } catch (error) {
        toast.error('Mở khóa tài khoản thất bại')
        setLoading(false)
      }
    }
  }

  const onBlock = async () => {
    setLoading(true)
    if (!admin.isBlock) {
      try {
        await adminService.block(admin._id, true)
        mutate()
        setOpenBlockAdminModal(false)
        setLoading(false)
        toast.success('Khóa tài khoản thành công')
      } catch (error) {
        toast.error('Khóa tài khoản thất bại')
        setLoading(false)
      }
    }
  }

  return (
    <>
      <AddAdminModal />
      <UpdateAdminModal />
      <AlertDelete
        title='Xác nhận xóa'
        content='Bạn có chắc chắn muốn xóa tài khoản này?'
        loading={loading}
        onClose={() => setOpenDeleteAdminModal(false)}
        open={openDeleteAdminModal}
        onSubmit={onDelete}
      />
      <AlertDelete
        title='Xác nhận chặn'
        content='Bạn có chắc chắn muốn chặn tài khoản này?'
        loading={loading}
        onClose={() => setOpenBlockAdminModal(false)}
        open={openBlockAdminModal}
        onSubmit={onBlock}
        submitText='Đồng ý'
      />
      <AlertDelete
        title='Xác nhận bỏ chặn'
        content='Bạn có chắc chắn muốn bỏ chặn tài khoản này?'
        loading={loading}
        onClose={() => setOpenUnblockAdminModal(false)}
        open={openUnblockAdminModal}
        onSubmit={onUnBlock}
        submitText='Đồng ý'
      />

      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Quản lý tài khoản</Typography>} />
            <CardContent>
              <Grid container display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    placeholder='Tìm kiếm theo tên tài khoản'
                    fullWidth
                    label='Tìm kiếm'
                    variant='outlined'
                    onChange={e => {
                      const newSearchKey = e.target.value
                      setSearchKeyInput(newSearchKey)
                      router.push({
                        pathname: '/admin-management',
                        query: {
                          ...searchParams, // giữ các giá trị searchParams hiện tại
                          search: newSearchKey,
                          page: 1 // reset về page 1 khi thay đổi searchKey
                        }
                      })
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button
                    onClick={() => {
                      setOpenAddAdminModal(true)
                    }}
                    fullWidth
                    size='small'
                    variant='contained'
                  >
                    <Typography variant='body1' color='#ffff'>
                      Thêm
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
            <Divider sx={{ m: '0 !important' }} />
            <TableAdmins page={page} rowsPerPage={pageLimit} data={admins || []} />
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
                <Select size='small' value={pageLimit} onChange={handlePageLimitChange}>
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

AdminPage.acl = {
  action: 'read',
  subject: 'admin'
}
export default AdminPage
