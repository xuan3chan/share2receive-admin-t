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
import useSWR, { mutate, preload } from 'swr'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import roleService from 'src/services/role/role.service'
import TableRoles from 'src/views/role-management/table'
import { useRoleStore } from 'src/zustand/roles'
import { useStateUX } from 'src/zustand/stateUX'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AddRoleModal } from 'src/views/role-management/addRole'
import { UpdateRoleModal } from 'src/views/role-management/updateRole'
import { AlertDelete } from 'src/views/components/alert'
import toast from 'react-hot-toast'
import { useDebounce } from 'use-debounce'

preload(['/api/role', 1, 9999, ''], () => roleService.getAll(1, 9999, ''))

const RolePage = () => {
  const router = useRouter()
  const searchParams = router.query
  const { setRoles, roles, setOpenAddRoleModal, role, setOpenDeleteRoleModal, openDeleteRoleModal } = useRoleStore()
  const { loading, setLoading } = useStateUX()
  const [searchKeyInput, setSearchKeyInput] = useState('')
  const [debouncedSearchKey] = useDebounce(searchKeyInput, 800)

  const page = Number(searchParams.page) || 1
  const pageLimit = Number(searchParams.limit) || 10

  const { data: rolesData, mutate: Mutate } = useSWR(
    ['/api/role', page, pageLimit, debouncedSearchKey],
    () => roleService.getAll(page, pageLimit, debouncedSearchKey),
    { onSuccess: data => setRoles(data.roles) }
  )

  const pageCount = Math.ceil((rolesData?.total || 0) / pageLimit)

  useEffect(() => {
    // Prefetch data for the next page
    if (page < pageCount) {
      const nextPage = page + 1
      mutate(
        ['/api/role', nextPage, pageLimit, debouncedSearchKey],
        roleService.getAll(nextPage, pageLimit, debouncedSearchKey),
        false
      )
    }
  }, [page, pageLimit, debouncedSearchKey, pageCount, mutate])

  const handlePageLimitChange = (e: { target: { value: any } }) => {
    const newLimit = e.target.value
    router.push({
      pathname: '/role-management',
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        limit: newLimit,
        page: 1 // reset về page 1 khi thay đổi pageLimit
      }
    })
  }

  const handlePageChange = (e: any, value: any) => {
    router.push({
      pathname: '/role-management',
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
      await roleService
        .delete(role._id)
        .then(() => {
          setOpenDeleteRoleModal(false)
          setLoading(false)
          Mutate()
          toast.success('Xóa vai trò thành công')
        })
        .catch(() => {
          setOpenDeleteRoleModal(false)
          setLoading(false)
          toast.error('Vai trò này đang được sử dụng')
        })
    } catch (error) {
      toast.error('Vai trò này đang được sử dụng')
    }
  }

  return (
    <>
      <AddRoleModal />
      <UpdateRoleModal />
      <AlertDelete
        title='Xóa vai trò'
        content='Bạn có chắc chắn muốn xóa vai trò này không?'
        onSubmit={onDelete}
        onClose={() => setOpenDeleteRoleModal(false)}
        open={openDeleteRoleModal}
        loading={loading}
      />
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Quản lý vai trò</Typography>} />
            <CardContent>
              <Grid container display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    placeholder='Tìm kiếm tên vai trò'
                    fullWidth
                    label='Tìm kiếm'
                    variant='outlined'
                    onChange={e => {
                      const newSearchKey = e.target.value
                      setSearchKeyInput(newSearchKey)
                      router.push({
                        pathname: '/role-management',
                        query: {
                          ...searchParams,
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
                      setOpenAddRoleModal(true)
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
            <TableRoles page={page} rowsPerPage={pageLimit} data={roles || []} />
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

RolePage.acl = {
  action: 'read',
  subject: 'role'
}
export default RolePage
