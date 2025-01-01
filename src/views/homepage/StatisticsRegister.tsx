import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useSWR from 'swr'
import statisticsService from 'src/services/statistics/statistics.service'
import { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardHeader, Grid, MenuItem, Typography } from '@mui/material'
import vi from 'date-fns/locale/vi'
import { format } from 'date-fns'
import CustomTextField from 'src/@core/components/mui/text-field'

import { subMonths, endOfMonth, startOfMonth } from 'date-fns'

import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import CardStatistic from './CardStatistic'
import { useSocket } from 'src/hooks/useSocket'

export default function StatisticsRegister({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) {
  registerLocale('vi', vi)

  const { socket } = useSocket()

  // Calculate default dates
  const currentDate = new Date()
  const defaultEndDate = endOfMonth(currentDate)
  const defaultStartDate = startOfMonth(subMonths(currentDate, 2)) // Go back 3 months

  const [startDate, setStartDate] = useState<Date>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date>(defaultEndDate)
  const [viewBy, setViewBy] = useState<string>('day')

  const [userOnline, setUserOnline] = useState<number>(0)
  const [userActive, setUserActive] = useState<number>(0)

  useEffect(() => {
    if (!socket) return

    // Request initial data immediately
    socket.emit('getTotalUserCount')
    socket.emit('getActiveUserCount')

    // Listen for updates
    socket.on('totalUserCount', message => {
      if (message?.count !== undefined) {
        setUserOnline(message.count)
      }
    })

    socket.on('activeUserCount', message => {
      if (message?.count !== undefined) {
        setUserActive(message.count)
      }
    })

    // Error handling
    socket.on('error', error => {
      console.error('Socket error:', error)
    })

    // Cleanup function
    return () => {
      socket.off('totalUserCount')
      socket.off('activeUserCount')
      socket.off('error')
    }
  }, [socket])

  const { data: statisticsRegister } = useSWR(
    [
      '/api/statistics/get-time-register',
      startDate ? format(startDate, 'yyyy-MM-dd') : '',
      endDate ? format(endDate, 'yyyy-MM-dd') : '',
      viewBy
    ],
    () =>
      statisticsService.getStatisticsRegister(
        startDate ? format(startDate, 'yyyy-MM-dd') : '',
        endDate ? format(endDate, 'yyyy-MM-dd') : '',
        viewBy
      ),
    {
      revalidateOnMount: true
    }
  )

  return (
    <Card>
      <CardHeader title={<Typography variant='h1'>Thống kê số người dùng đã đăng ký</Typography>} />
      <div
        style={{
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <Grid item container spacing={3} xs={12}>
          <Grid item xs={6}>
            <CardStatistic
              title='Tổng lượng đang truy cập'
              number={userOnline.toString()}
              icon='lucide:users'
              color='success'
              bgColor='rgba(76, 175, 80, 0.1)'
            />
          </Grid>
          <Grid item xs={6}>
            <CardStatistic
              title='Người dùng đã đăng nhập trực tuyến'
              number={userActive.toString()}
              icon='mdi:user-online-outline'
              color='success'
              bgColor='rgba(76, 175, 80, 0.1)'
              activeStatus
            />
          </Grid>
        </Grid>
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
                <BarChart
                  data={statisticsRegister}
                  barSize={15}
                  margin={{
                    left: -20
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='time' fontSize={12} height={70} interval={0} tick={{ dy: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='count' name='Số lượng' fill='green' radius={[15, 15, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </div>
    </Card>
  )
}
