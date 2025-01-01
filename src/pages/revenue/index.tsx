import { Card, CardContent, Grid, MenuItem, Pagination, Select, SelectChangeEvent, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import useSWR from 'swr'
import revenueService from 'src/services/revenue/revenue.service'
import { useState } from 'react'
import { useRouter } from 'next/router'
import TableData from 'src/views/revenue/TableData'
import CustomTextField from 'src/@core/components/mui/text-field'

const CardSummary = ({ title, value }: { title: string; value: number }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>{title}</Typography>
        <Typography variant='h2' color='#0A97B0'>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function RevenuePage() {
  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const filterBy = searchParams.filterBy?.toString() || ''
  const filterValue = searchParams.filterValue?.toString() || ''

  const [total, setTotal] = useState<number>(0)
  const [filter, setFilter] = useState<string>('')
  const { data } = useSWR(
    ['/api/revenue/get-revenue-For-manager', page, limit, filterBy, filterValue],
    () => revenueService.getRevenue(page, limit, filterBy, filterValue),
    {
      onSuccess: data => {
        setTotal(data.pagination.totalRevenue)
      },
      revalidateOnMount: true
    }
  )

  const pageCount = Math.ceil(total / limit)

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push({
      pathname: '/revenue',
      query: { ...searchParams, page: value }
    })
  }

  const handlePageLimitChange = (event: SelectChangeEvent) => {
    router.push({
      pathname: '/revenue',
      query: { ...searchParams, limit: event.target.value }
    })
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value)
    router.push({
      pathname: '/revenue',
      query: { ...searchParams, filterBy: 'description', filterValue: event.target.value }
    })
  }

  return (
    <>
      <PageHeader title={<Typography variant='h1'>Danh sách doanh thu</Typography>} />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <CardSummary title='Tổng kim cương bán ra' value={data?.summarize?.totalSale || 0} />
        </Grid>
        <Grid item xs={3}>
          <CardSummary title='Tổng kim cương chuyển đổi' value={data?.summarize?.totalBuy || 0} />
        </Grid>
        <Grid item xs={3}>
          <CardSummary title='Tổng kim cương khuyến mãi' value={data?.summarize?.totalPromotion || 0} />
        </Grid>
        <Grid item xs={3}>
          <CardSummary title='Tổng kim cương đăng bài' value={data?.summarize?.totalProduct || 0} />
        </Grid>
      </Grid>
      <Card sx={{ mt: 5 }}>
        <CardContent>
          <Grid container>
            <Grid item xs={3}>
              <CustomTextField
                fullWidth
                label='Lọc theo hình thức'
                name='filterBy'
                select
                SelectProps={{ displayEmpty: true }}
                size='small'
                value={filter}
                variant='outlined'
                onChange={handleFilterChange}
              >
                <MenuItem value=''>Tất cả</MenuItem>
                <MenuItem value='sale'>Bán ra</MenuItem>
                <MenuItem value='buy'>Chuyển đổi</MenuItem>
                <MenuItem value='promotion'>Khuyến mãi</MenuItem>
                <MenuItem value='product'>Đăng bài</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
        <TableData data={data?.data || []} />
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
            <Select size='small' value={limit.toString()} onChange={handlePageLimitChange}>
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
    </>
  )
}
