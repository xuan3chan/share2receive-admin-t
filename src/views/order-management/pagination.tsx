import { Grid, Typography, Select, MenuItem, Pagination, SelectChangeEvent } from '@mui/material'

export default function PaginationComponent({
  page,
  pageCount,
  limit,
  handlePageChange,
  handlePageLimitChange
}: {
  page: number
  pageCount: number
  limit: number
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void
  handlePageLimitChange: (event: SelectChangeEvent<number>) => void
}) {
  return (
    <>
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
    </>
  )
}
