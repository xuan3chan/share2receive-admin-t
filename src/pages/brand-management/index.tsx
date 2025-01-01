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
import brandService from 'src/services/brand/brand.service'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useBrandStore } from 'src/zustand/brand'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AddBrandModal } from 'src/views/brand/addBrand'
import TableBrand from 'src/views/brand/table'
import { UpdateBrandModal } from 'src/views/brand/updateBrand'
import { ViewBrandModal } from 'src/views/brand/viewBrand'

const pathname = '/brand-management'

const BrandPage = () => {
  const { brands, brand, setBrands, setOpenDeleteBrand, openDeleteBrand, setOpenCreateBrand } = useBrandStore()

  const { setLoading, loading } = useStateUX()
  const [searchKeyInput, setSearchKeyInput] = useState('')
  const [debouncedSearchKey] = useDebounce(searchKeyInput, 800)

  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortField = searchParams.sortField?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const { data: categoryData, mutate } = useSWR(
    ['/api/brand', page, limit, debouncedSearchKey, sortField, sortOrder],
    () => brandService.getAll(page, limit, debouncedSearchKey, sortField, sortOrder),
    { onSuccess: data => setBrands(data?.brand) }
  )

  const pageCount = Math.ceil((categoryData?.total || 0) / limit)

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

  const handleDeleteBrand = async () => {
    setLoading(true)
    try {
      const res = await brandService.delete(brand._id)
      console.log(res.data)
      toast.success('Xóa tương hiệu thành công')
      setOpenDeleteBrand(false)
      mutate()
    } catch (error) {
      toast.error('Xóa tương hiệu thất bại')
      setOpenDeleteBrand(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AddBrandModal />
      <UpdateBrandModal />
      <ViewBrandModal />
      <AlertDelete
        title='Xác nhận xóa thương hiệu'
        content='Thương hiệu này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa?'
        loading={loading}
        open={openDeleteBrand}
        onClose={() => setOpenDeleteBrand(false)}
        onSubmit={handleDeleteBrand}
      />
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Quản lý thương hiệu</Typography>} />
            <CardContent>
              <Grid container display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    placeholder='Tìm kiếm thương hiệu'
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
                <Grid item xs={12} md={1}>
                  <Button fullWidth size='small' variant='contained' onClick={() => setOpenCreateBrand(true)}>
                    <Typography
                      sx={{
                        color: '#ffff'
                      }}
                      variant='body1'
                    >
                      Thêm
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
            <Divider sx={{ m: '0 !important' }} />
            <TableBrand page={page} pageLimit={limit} data={brands || []} />
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

BrandPage.acl = {
  action: 'read',
  subject: 'brand'
}
export default BrandPage
