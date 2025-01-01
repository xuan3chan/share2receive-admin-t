import { CardContent, CardHeader, Card, Grid, Typography, Divider, Select, MenuItem, Pagination } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDebounce } from 'use-debounce'
import useSWR, { mutate } from 'swr'
import TableProduct from 'src/views/product-management/table'
import productService from 'src/services/product/product.service'
import { useProductStore } from 'src/zustand/product'
import { ApproveModal } from 'src/views/product-management/approveModal'
import { AlertDelete } from 'src/views/components/alert'
import { useStateUX } from 'src/zustand/stateUX'
import toast from 'react-hot-toast'
import { ViewProductModal } from 'src/views/product-management/viewProduct'
import { Product } from 'src/types/product/productType'

const pathname = '/product-management'

const ProductManagementPage = () => {
  const {
    products,
    setProducts,
    setOpenBlockProduct,
    openBlockProduct,
    product,
    openUnblockProduct,
    setProduct,
    setOpenUnblockProduct
  } = useProductStore()

  const { setLoading, loading } = useStateUX()
  const [searchKeyInput, setSearchKeyInput] = useState('')
  const [debouncedSearchKey] = useDebounce(searchKeyInput, 800)
  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortField = searchParams.sortField?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const { data: productData } = useSWR(
    ['productClient', page, limit, debouncedSearchKey, sortField, sortOrder],
    () => productService.getAll(page, limit, debouncedSearchKey, sortField, sortOrder),
    { onSuccess: data => setProducts(data?.products) }
  )

  const pageCount = Math.ceil((productData?.total || 0) / limit)

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

  const onClose = () => {
    setOpenBlockProduct(false)
    setOpenUnblockProduct(false)
    setProduct({} as Product)
  }

  const onBlockProduct = async () => {
    setLoading(true)
    try {
      await productService.block(product._id, true)
      mutate(['productClient', page, limit, debouncedSearchKey, sortField, sortOrder])
      toast.success('Chặn sản phẩm thành công')
      onClose()
    } catch (error) {
      toast.error('Chặn sản phẩm thất bại')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const onUnBlockProduct = async () => {
    setLoading(true)
    try {
      await productService.block(product._id, false)
      mutate(['productClient', page, limit, debouncedSearchKey, sortField, sortOrder])
      toast.success('Bỏ chặn sản phẩm thành công')
      onClose()
    } catch (error) {
      toast.error('Bỏ chặn sản phẩm thất bại')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ViewProductModal />
      <ApproveModal />
      <AlertDelete
        title='Xác nhận chặn sản phẩm'
        content='Bạn có chắc chắn muốn chặn sản phẩm này không?'
        loading={loading}
        onClose={() => {
          setOpenBlockProduct(false)
        }}
        open={openBlockProduct}
        submitText='Chặn'
        onSubmit={onBlockProduct}
      />
      <AlertDelete
        title='Xác nhận bỏ chặn sản phẩm'
        content='Bạn có chắc chắn muốn bỏ chặn sản phẩm này không?'
        loading={loading}
        onClose={() => {
          setOpenUnblockProduct(false)
        }}
        open={openUnblockProduct}
        submitText='Bỏ chặn'
        onSubmit={onUnBlockProduct}
      />
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Quản lý sản phẩm</Typography>} />
            <CardContent>
              <Grid container display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    placeholder='Tìm kiếm sản phẩm'
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
            <TableProduct page={page} pageLimit={limit} data={products || []} />
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
ProductManagementPage.acl = {
  action: 'read',
  subject: 'product'
}
export default ProductManagementPage
