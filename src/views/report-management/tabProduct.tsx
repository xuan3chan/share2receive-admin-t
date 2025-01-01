import {
  Card,
  Grid,
  CardHeader,
  Typography,
  Divider,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  CardContent
} from '@mui/material'
import TableProduct from './tableDataProduct'
import { ReportProduct } from 'src/types/report/reportTypes'

export default function TabProduct({
  reportProduct,
  page,
  pageCount,
  limit,
  handlePageChange,
  handlePageLimitChange,
  handleConfirmReport
}: {
  reportProduct: ReportProduct[]
  page: number
  pageCount: number
  limit: any
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void
  handlePageLimitChange: (event: SelectChangeEvent) => void
  handleConfirmReport: (id: string, isChecked: string) => Promise<void>
}) {
  return (
    <Card>
      <CardHeader title={<Typography variant='h3'>Danh sách khiếu nại sản phẩm</Typography>} />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='h6'>
              <span
                style={{
                  color: 'red'
                }}
              >
                *
              </span>
              Ghi chú:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6'>
              - Các sản phẩm được quản trị viên xác nhận 3 lần hệ thống sẽ cảnh báo người dùng
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6'>
              - Các sản phẩm được quản trị viên xác nhận 4 lần hệ thống sẽ khóa sản phẩm
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6'>
              - Các sản phẩm được quản trị viên xác nhận 5 lần hệ thống sẽ khoá tài khoản người dùng vĩnh viễn
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      <TableProduct data={reportProduct || []} handleConfirmReport={handleConfirmReport} />
      <Divider />
      <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100px' }}>
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
  )
}
