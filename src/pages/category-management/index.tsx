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
import categoryService from 'src/services/category/category.service'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useCategoryStore } from 'src/zustand/category'
import CustomTextField from 'src/@core/components/mui/text-field'
import TableCategory from 'src/views/category/table'
import { AddCategoryModal } from 'src/views/category/addCategory'
import { UpdateCategoryModal } from 'src/views/category/updateCategory'
import { ViewCategoryModal } from 'src/views/category/viewCategory'

const pathname = '/category-management'

const CategoryPage = () => {
  const { categories, category, setCategories, setOpenDeleteCategory, setOpenCreateCategory, openDeleteCategory } =
    useCategoryStore()

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
    ['/api/category', page, limit, debouncedSearchKey, sortField, sortOrder],
    () => categoryService.getAll(page, limit, debouncedSearchKey, sortField, sortOrder),
    { onSuccess: data => setCategories(data?.category) }
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

  const handleDeleteCategory = async () => {
    setLoading(true)
    try {
      const res = await categoryService.delete(category._id)
      console.log(res.data)
      mutate()
      toast.success('Xóa danh mục thành công')
      setOpenDeleteCategory(false)
    } catch (error) {
      toast.error('Xóa danh mục thất bại')
      setOpenDeleteCategory(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AddCategoryModal />
      <UpdateCategoryModal />
      <ViewCategoryModal />
      <AlertDelete
        title='Xác nhận xóa danh mục'
        content='Danh mục này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa?'
        loading={loading}
        open={openDeleteCategory}
        onClose={() => setOpenDeleteCategory(false)}
        onSubmit={handleDeleteCategory}
      />
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Quản lý danh mục</Typography>} />
            <CardContent>
              <Grid container display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    placeholder='Tìm kiếm danh mục'
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
                  <Button fullWidth size='small' variant='contained' onClick={() => setOpenCreateCategory(true)}>
                    <Typography
                      sx={{
                        color: 'white'
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
            <TableCategory page={page} pageLimit={limit} data={categories || []} />
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

CategoryPage.acl = {
  action: 'read',
  subject: 'category'
}
export default CategoryPage
