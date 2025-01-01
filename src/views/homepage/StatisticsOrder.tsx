import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { Box, Card, CardContent, CardHeader, Grid, MenuItem, Typography } from '@mui/material'
import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format, startOfMonth, addDays } from 'date-fns'
import { useState } from 'react'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import useSWR from 'swr'
import statisticsService from 'src/services/statistics/statistics.service'
import vi from 'date-fns/locale/vi'
import { useStatisticsOrder } from 'src/zustand/homepage'
import CardStatistic from './CardStatistic'
import { formatPrice } from 'src/helpers'

export default function StatisticsOrder({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) {
  registerLocale('vi', vi)
  const { setStatisticsOrder } = useStatisticsOrder()

  // Calculate default dates
  const currentDate = new Date()
  const defaultStartDate = startOfMonth(currentDate)
  const defaultEndDate = addDays(defaultStartDate, 14)

  const [startDate, setStartDate] = useState<Date>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date>(defaultEndDate)
  const [viewBy, setViewBy] = useState<string>('day')

  const { data: statisticsOrder } = useSWR(
    [
      '/api/statistics/get-time-order',
      startDate ? format(startDate, 'yyyy-MM-dd') : '',
      endDate ? format(endDate, 'yyyy-MM-dd') : '',
      viewBy
    ],
    () =>
      statisticsService.getStatisticsOrder(
        startDate ? format(startDate, 'yyyy-MM-dd') : '',
        endDate ? format(endDate, 'yyyy-MM-dd') : '',
        viewBy
      ),
    {
      onSuccess: data => {
        setStatisticsOrder(data)
      },
      revalidateOnMount: true
    }
  )

  return (
    <Card>
      <CardHeader title={<Typography variant='h1'>Thống kê các đơn hàng toàn hệ thống</Typography>} />
      <div style={{ padding: '1rem' }}>
        {statisticsOrder?.allSummary && (
          <Grid item container spacing={3} xs={12}>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng thanh toán'
                number={`${formatPrice(statisticsOrder.allSummary.totalPaid)}`}
                subtitle='VNĐ'
                icon='ic:outline-paid'
                color='success'
                bgColor='rgba(46, 125, 50, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng đã hoàn tiền'
                number={`${formatPrice(statisticsOrder.allSummary.totalRefund)}`}
                subtitle='VNĐ'
                icon='ri:refund-2-line'
                color='error'
                bgColor='rgba(211, 47, 47, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng phí vận chuyển'
                number={`${formatPrice(statisticsOrder.allSummary.totalShippingFee)}`}
                subtitle='VNĐ'
                icon='fluent:feed-32-regular'
                color='warning'
                bgColor='rgba(237, 108, 2, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng doanh thu nhà bán hàng'
                number={`${formatPrice(statisticsOrder.allSummary.totalSubTotal)}`}
                subtitle='VNĐ'
                icon='cil:chart-line'
                color='info'
                bgColor='rgba(2, 136, 209, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng yêu cầu hoàn tiền'
                number={`${formatPrice(statisticsOrder.allSummary.totalRefundedOrders)}`}
                subtitle='Yêu cầu hoàn tiền'
                icon='gridicons:refund'
                color='error'
                bgColor='rgba(194, 24, 91, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng đơn hàng hoàn thành'
                number={`${formatPrice(statisticsOrder.allSummary.totalCompletedOrders)}`}
                subtitle='Đơn hoàn thành'
                icon='gg:check-o'
                color='success'
                bgColor='rgba(27, 94, 32, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng đơn hàng đã hủy'
                number={`${formatPrice(statisticsOrder.allSummary.totalCanceledOrders)}`}
                subtitle='Yêu cầu hủy'
                icon='ic:outline-cancel'
                color='error'
                bgColor='rgba(183, 28, 28, 0.1)'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatistic
                title='Tổng số lượng đơn hàng'
                number={`${formatPrice(
                  statisticsOrder.allSummary.totalCanceledOrders +
                    statisticsOrder.allSummary.totalCompletedOrders +
                    statisticsOrder.allSummary.totalRefundedOrders
                )}`}
                subtitle='Tất cả đơn hàng'
                icon='lsicon:order-outline'
                color='info'
                bgColor='rgba(21, 101, 192, 0.1)'
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
            <Box sx={{ display: 'flex', gap: 2, mb: 5 }}>
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
                    showMonthYearPicker={viewBy === 'month'}
                    showYearPicker={viewBy === 'year'}
                    locale='vi'
                    selected={startDate}
                    maxDate={endDate || undefined}
                    id='statistics-register-start-date-dropdown'
                    dateFormat={viewBy === 'month' ? 'MM-yyyy' : viewBy === 'year' ? 'yyyy' : 'dd-MM-yyyy'}
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
                    locale='vi'
                    showMonthYearPicker={viewBy === 'month'}
                    showYearPicker={viewBy === 'year'}
                    selected={endDate}
                    minDate={startDate || undefined}
                    maxDate={viewBy === 'day' ? addDays(startDate, 14) : viewBy === 'month' ? undefined : undefined}
                    dateFormat={viewBy === 'month' ? 'MM-yyyy' : viewBy === 'year' ? 'yyyy' : 'dd-MM-yyyy'}
                    id='statistics-register-end-date-dropdown'
                    placeholderText='MM-DD-YYYY'
                    popperPlacement={popperPlacement}
                    onChange={(date: Date) => setEndDate(date)}
                    customInput={<PickersComponent label='Ngày kết thúc' />}
                    disabled={!startDate}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={statisticsOrder?.dailyDetails.map(item => ({
                    date: item.date,
                    paidUUIDs: item.paidUUIDs,
                    refundedUUIDs: item.refundedUUIDs,
                    totalSubTotal: item.summary.totalSubTotal,
                    totalShippingFee: item.summary.totalShippingFee,
                    totalRefund: item.summary.totalRefund,
                    totalPaid: item.summary.totalPaid,
                    totalCompletedOrders: item.summary.totalCompletedOrders,
                    totalRefundedOrders: item.summary.totalRefundedOrders,
                    totalCanceledOrders: item.summary.totalCanceledOrders
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' fontSize={12} height={70} interval={0} tick={{ dy: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    name='Tổng doanh thu nhà bán hàng'
                    dataKey='totalSubTotal'
                    stroke='#8884d8'
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type='monotone'
                    name='Tổng phí vận chuyển'
                    dataKey='totalShippingFee'
                    stroke='#82ca9d'
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type='monotone'
                    name='Tổng hoàn tiền'
                    dataKey='totalRefund'
                    stroke='#ff7300'
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type='monotone'
                    name='Tổng đã thanh toán'
                    dataKey='totalPaid'
                    stroke='#ff0000'
                    activeDot={{ r: 8 }}
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
