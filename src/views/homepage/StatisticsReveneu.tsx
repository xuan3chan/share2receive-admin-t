import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts'
import { Box, Card, CardContent, CardHeader, Grid, MenuItem, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { useState } from 'react'
import statisticsService from 'src/services/statistics/statistics.service'
import useSWR from 'swr'
import { useStatisticsOrder } from 'src/zustand/homepage'
import { formatPrice } from 'src/helpers'
import CardStatisticRevenue from './Card'

export default function StatisticsReveneu({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) {
  const { setStatisticsRevenue } = useStatisticsOrder()

  // Calculate default dates
  const currentDate = new Date()
  const defaultEndDate = endOfMonth(currentDate)
  const defaultStartDate = startOfMonth(subMonths(currentDate, 2)) // Go back 3 months

  const [startDate, setStartDate] = useState<Date>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date>(defaultEndDate)
  const [viewBy, setViewBy] = useState<string>('revenue')
  const [dateBy, setDateBy] = useState<string>('day')

  const { data: statisticsRevenue } = useSWR(
    [
      '/api/statistics/get-static-revenue',
      startDate ? startDate.toISOString() : '',
      endDate ? endDate.toISOString() : '',
      viewBy,
      dateBy
    ],
    () =>
      statisticsService.getStatisticsRevenue(
        startDate ? startDate.toISOString() : '',
        endDate ? endDate.toISOString() : '',
        viewBy,
        dateBy
      ),
    {
      onSuccess: data => {
        setStatisticsRevenue(data)
      },
      revalidateOnMount: true
    }
  )

  return (
    <Card>
      <CardHeader title={<Typography variant='h1'>Thống kê doanh thu nền tảng</Typography>} />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <CustomTextField
                fullWidth
                select
                label='Xem theo'
                value={viewBy}
                onChange={e => setViewBy(e.target.value)}
              >
                <MenuItem disabled value=''>
                  <Typography variant='body1'>Chọn dữ liệu cần thống kê</Typography>
                </MenuItem>
                <MenuItem value='revenue'>
                  <Typography variant='body1'>Theo Doanh thu hệ thống</Typography>
                </MenuItem>
                <MenuItem value='point'>
                  <Typography variant='body1'>Theo số lượng kim cương chuyển đổi</Typography>
                </MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={3}>
              <CustomTextField
                fullWidth
                select
                label='Xem theo ngày/tháng/năm'
                value={dateBy}
                onChange={e => setDateBy(e.target.value)}
              >
                <MenuItem disabled value=''>
                  <Typography variant='body1'>Chọn xem theo</Typography>
                </MenuItem>
                <MenuItem value='day'>
                  <Typography variant='body1'>Theo ngày</Typography>
                </MenuItem>
                <MenuItem value='month'>
                  <Typography variant='body1'>Theo tháng</Typography>
                </MenuItem>
                <MenuItem value='year'>
                  <Typography variant='body1'>Theo năm</Typography>
                </MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={3}>
              <DatePicker
                showYearDropdown
                showMonthDropdown
                showMonthYearPicker={dateBy === 'month'}
                showYearPicker={dateBy === 'year'}
                locale='vi'
                selected={startDate}
                maxDate={endDate || undefined}
                id='statistics-register-start-date-dropdown'
                dateFormat={dateBy === 'month' ? 'dd-MM-yyyy' : dateBy === 'year' ? 'dd-MM-yyyy' : 'dd-MM-yyyy'}
                placeholderText='MM-DD-YYYY'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => setStartDate(date)}
                customInput={<PickersComponent label='Ngày bắt đầu' />}
              />
            </Grid>
            <Grid item xs={3}>
              <DatePicker
                showYearDropdown
                showMonthDropdown
                showMonthYearPicker={dateBy === 'month'}
                showYearPicker={dateBy === 'year'}
                selected={endDate}
                minDate={startDate || undefined}
                dateFormat={dateBy === 'month' ? 'dd-MM-yyyy' : dateBy === 'year' ? 'dd-MM-yyyy' : 'dd-MM-yyyy'}
                id='statistics-register-end-date-dropdown'
                placeholderText='MM-DD-YYYY'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => {
                  if (dateBy === 'month') {
                    setEndDate(endOfMonth(date))
                  } else {
                    setEndDate(date)
                  }
                }}
                customInput={<PickersComponent label='Ngày kết thúc' />}
                disabled={!startDate}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <div
        style={{
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        {statisticsRevenue && (
          <Grid item container spacing={3} xs={12}>
            <Grid item xs={3}>
              <CardStatisticRevenue
                title={viewBy === 'point' ? 'Lượng chuyển đổi kim cương' : 'Doanh số bán ra'}
                number={`${formatPrice(statisticsRevenue.summarize.totalSale)}`}
                subtitle={viewBy === 'point' ? 'Kim cương' : 'VNĐ'}
                color='info'
                viewBy={viewBy}
                icon='mingcute:sale-line'
                iconPoint='ri:exchange-line'
                bgColor='rgba(2, 136, 209, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatisticRevenue
                title={viewBy === 'point' ? 'Lượng sử dụng kim cương' : 'Lượng sử dụng kim cương'}
                number={`${formatPrice(statisticsRevenue.summarize.totalBuy)}`}
                subtitle={viewBy === 'point' ? 'Kim cương' : 'VNĐ'}
                color='success'
                viewBy={viewBy}
                icon='material-symbols:energy-program-time-used-outline-rounded'
                iconPoint='material-symbols:energy-program-time-used-outline-rounded'
                bgColor='rgba(46, 125, 50, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatisticRevenue
                title={viewBy === 'point' ? 'Kim cương thặng dư' : 'Doanh thu thuần'}
                number={`${formatPrice(statisticsRevenue.summarize.totalProduct)}`}
                subtitle={viewBy === 'point' ? 'Kim cương' : 'VNĐ'}
                color='warning'
                viewBy={viewBy}
                icon='uil:chart-bar'
                iconPoint='lucide:chart-line'
                bgColor='rgba(237, 108, 2, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatisticRevenue
                title={viewBy === 'point' ? 'Lượng kim cương khuyến mãi' : 'Chi phí khuyến mãi'}
                number={`${formatPrice(statisticsRevenue.summarize.totalPromotion)}`}
                subtitle={viewBy === 'point' ? 'Kim cương' : 'VNĐ'}
                color='error'
                viewBy={viewBy}
                icon='lsicon:badge-promotion-outline'
                iconPoint='lsicon:badge-promotion-outline'
                bgColor='rgba(211, 47, 47, 0.1)'
              />
            </Grid>
          </Grid>
        )}
      </div>
      <div
        style={{
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <Card
          sx={{
            borderRadius: '12px',
            boxShadow: 0,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          <CardContent>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={statisticsRevenue?.data}
                  margin={{
                    top: 15,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' fontSize={12} height={70} interval={0} tick={{ dy: 10 }} />
                  <YAxis unit={viewBy === 'point' ? ' kc' : ' vnđ'} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='promotionAmount'
                    name='Chi phí khuyến mãi'
                    stroke='#8884d8'
                    strokeWidth={2}
                    unit={viewBy === 'point' ? ' kim cương' : 'vnđ'}
                  />
                  <Line
                    type='monotone'
                    dataKey='saleAmount'
                    name='Doanh số bán ra'
                    stroke='#9f87ff'
                    strokeWidth={2}
                    unit={viewBy === 'point' ? ' kim cương' : 'vnđ'}
                  />
                  <Line
                    type='monotone'
                    dataKey='buyAmount'
                    name='Lượng sử dụng kim cương'
                    stroke='#d2b0ff'
                    strokeWidth={2}
                    unit=' kim cương'
                  />
                  <Line
                    type='monotone'
                    dataKey='productAmount'
                    name='Doanh thu thuần'
                    stroke='#f8d3ff'
                    strokeWidth={2}
                    unit={viewBy === 'point' ? ' kim cương' : 'vnđ'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </div>
    </Card>
  )
}
