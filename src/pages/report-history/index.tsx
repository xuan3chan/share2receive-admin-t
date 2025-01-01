import { Card, Grid, MenuItem, Pagination, Select, SelectChangeEvent, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import TableData from 'src/views/report-history/tableData'
import useSWR from 'swr'
import reportService from 'src/services/report/report.service'
import { ChangeEvent } from 'react'
import { useRouter } from 'next/router'

export default function ReportHistoryPage() {
  const router = useRouter()
  const pageNumber = Number(router.query.page) || 1
  const limitNumber = Number(router.query.limit) || 10

  const { data: ReportHistory } = useSWR('/api/report-history', reportService.getReportHistory)

  // Pagination helpers
  const getPaginatedData = () => {
    const startIndex = (pageNumber - 1) * limitNumber
    const endIndex = startIndex + limitNumber

    return ReportHistory ? ReportHistory.slice(startIndex, endIndex) : []
  }

  const pageCount = ReportHistory ? Math.ceil(ReportHistory.length / limitNumber) : 0

  // Handlers
  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    router.push({
      pathname: '/report-history',
      query: {
        ...router.query,
        page: value
      }
    })
  }

  const handlePageLimitChange = (event: SelectChangeEvent<number>) => {
    router.push({
      pathname: '/report-history',
      query: {
        ...router.query,
        limit: event.target.value
      }
    })
  }

  return (
    <>
      <PageHeader
        title={<Typography variant='h1'>Lịch sử thao tác khiếu nại</Typography>}
        subtitle='Xem lại các thao tác đã thực hiện trên danh sách khiếu nại'
      />
      <Card sx={{ mt: 5 }}>
        <TableData data={getPaginatedData()} />
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
            <Select size='small' value={limitNumber} onChange={handlePageLimitChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </Grid>
          <Grid>
            <Pagination count={pageCount} page={pageNumber} onChange={handlePageChange} color='primary' />
          </Grid>
        </Grid>
      </Card>
    </>
  )
}
