import { Button, Card, CardContent, Grid, IconButton, MenuItem, Tooltip, Typography, Drawer } from '@mui/material'
import { useRouter } from 'next/router'
import vi from 'date-fns/locale/vi'
import PageHeader from 'src/@core/components/page-header'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import useSWR from 'swr'
import { useOrderStore } from 'src/zustand/order'
import { motion, AnimatePresence } from 'framer-motion'

import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import IconifyIcon from 'src/@core/components/icon'
import paymentsService from 'src/services/payments/payments.service'
import { Payment } from 'src/types/payments/paymentsType'
import PaymentCard from 'src/views/payments/paymentCard'
import toast from 'react-hot-toast'
import ModalUpdate from 'src/views/payments/modalUpdate'
import { handleExportExcel } from 'src/helpers'
import PaymentDetail from 'src/views/payments/PaymentDetail'

const pathname = '/payments'

// Thêm các constant cho sort
const SORT_OPTIONS = {
  AMOUNT: 'totalAmount',
  DATE: 'createdAt',
  STATUS: 'status'
} as const

export default function Payments({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) {
  const router = useRouter()
  const searchParams = router.query
  registerLocale('vi', vi)

  const page = Number(searchParams.page?.toString()) || 1
  const limit = Number(searchParams.limit?.toString()) || 10
  const payProcessStatusQ = searchParams.payProcessStatus?.toString() || 'pending'
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''
  const dateFrom = searchParams.dateFrom?.toString() || dayjs().startOf('month').format('YYYY-MM-DD')
  const dateTo = searchParams.dateTo?.toString() || dayjs().endOf('month').format('YYYY-MM-DD')

  const [payProcessStatus, setPayProcessStatus] = useState<string>(payProcessStatusQ)

  const [month, setMonth] = useState<DateType>(dateFrom ? dayjs(dateFrom).toDate() : dayjs().toDate())

  const [startDate, setStartDate] = useState<string>(dateFrom)
  const [endDate, setEndDate] = useState<string>(dateTo)
  const [monthNumber, setMonthNumber] = useState<string>(dayjs(dateFrom).format('MM'))
  const [open, setOpen] = useState<boolean>(false)
  const { openDetail, setOpenDetail } = useOrderStore()

  const [selectedCards, setSelectedCards] = useState<Payment[]>([])

  const handleOnChangeMonth = (date: Date) => {
    const newStartDate = dayjs(date).startOf('month').format('YYYY-MM-DD')
    const newEndDate = dayjs(date).endOf('month').format('YYYY-MM-DD')

    setStartDate(newStartDate)
    setEndDate(newEndDate)
    setMonth(date)
    setMonthNumber(dayjs(date).format('MM'))
    router.push({
      pathname: pathname,
      query: {
        ...searchParams,
        dateFrom: newStartDate,
        dateTo: newEndDate
      }
    })

    setSelectedCards([])
  }

  const { mutate, data: Data } = useSWR(
    ['/payments', page, limit, sortBy, sortOrder, dateFrom, dateTo, payProcessStatusQ],
    () => paymentsService.getPayments(page, limit, sortBy, sortOrder, dateFrom, dateTo, payProcessStatusQ),
    {
      revalidateOnMount: true
    }
  )

  const handleCardSelect = (payment: Payment) => {
    setSelectedCards(prev => {
      if (!payment?.seller?._id) return prev

      if (prev.some(item => item?.seller?._id === payment.seller._id)) {
        return prev.filter(item => item?.seller?._id !== payment?.seller?._id)
      }

      return [...prev, payment]
    })
  }

  // Trong component Payments, thêm các hàm xử lý sort
  const handleSort = (sortField: string) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'

    router.push({
      pathname,
      query: {
        ...searchParams,
        sortBy: sortField,
        sortOrder: newSortOrder
      }
    })
  }

  const handleUpdatePayment = async () => {
    if (selectedCards.length === 0) return

    await paymentsService.updatePayment(
      selectedCards.map(item => item.subOrdersPaid[0]),
      payProcessStatus,
      () => {
        toast.success('Cập nhật trạng thái thanh toán thành công')
        mutate()
        setOpen(false)
        setSelectedCards([])
      },
      error => {
        toast.error(error)
        setOpen(false)
      }
    )
  }

  return (
    <>
      <Drawer open={openDetail} onClose={() => setOpenDetail(false)} anchor='right'>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <IconButton onClick={() => setOpenDetail(false)}>
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </div>
        <PaymentDetail />
      </Drawer>
      <ModalUpdate
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        onUpdate={handleUpdatePayment}
        payProcessStatus={payProcessStatus}
        setPayProcessStatus={setPayProcessStatus}
      />
      <DatePickerWrapper>
        <PageHeader title={<Typography variant='h2'>Danh sách thanh toán</Typography>} />
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h4'>Bộ lọc</Typography>
              </Grid>
              <Grid item xs={2}>
                <DatePicker
                  className='cascac'
                  selected={month}
                  id='month-picker'
                  showMonthYearPicker
                  dateFormat='MM/yyyy'
                  locale='vi'
                  popperPlacement={popperPlacement}
                  onChange={handleOnChangeMonth}
                  customInput={<PickersComponent label='Theo tháng' />}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomTextField
                  fullWidth
                  label='Theo trạng thái thanh toán'
                  select
                  defaultValue={payProcessStatus}
                  onChange={e => {
                    setSelectedCards([])
                    router.push({
                      pathname: pathname,
                      query: { ...searchParams, payProcessStatus: e.target.value }
                    })
                  }}
                >
                  <MenuItem value='pending'>Chờ thanh toán</MenuItem>
                  <MenuItem value='processing'>Đang xử lý</MenuItem>
                  <MenuItem value='completed'>Đã thanh toán</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={2} spacing={2} sx={{ display: 'flex', alignItems: 'end' }}>
                <Tooltip title='Sắp xếp theo số tiền'>
                  <IconButton
                    onClick={() => handleSort(SORT_OPTIONS.AMOUNT)}
                    color={sortBy === SORT_OPTIONS.AMOUNT ? 'primary' : 'default'}
                  >
                    <IconifyIcon
                      icon={`mdi:sort-${
                        sortBy === SORT_OPTIONS.AMOUNT ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'variant'
                      }`}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Sắp xếp theo ngày'>
                  <IconButton
                    onClick={() => handleSort(SORT_OPTIONS.DATE)}
                    color={sortBy === SORT_OPTIONS.DATE ? 'primary' : 'default'}
                  >
                    <IconifyIcon
                      icon={`mdi:${
                        sortBy === SORT_OPTIONS.DATE
                          ? sortOrder === 'asc'
                            ? 'sort-calendar-ascending'
                            : 'sort-calendar-descending'
                          : 'calendar'
                      }`}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Sắp xếp theo trạng thái'>
                  <IconButton
                    onClick={() => handleSort(SORT_OPTIONS.STATUS)}
                    color={sortBy === SORT_OPTIONS.STATUS ? 'primary' : 'default'}
                  >
                    <IconifyIcon
                      icon={`mdi:sort-${
                        sortBy === SORT_OPTIONS.STATUS
                          ? sortOrder === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'alphabetical-variant'
                      }`}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => setOpen(true)}
                  disabled={selectedCards.length === 0}
                >
                  Cập nhật trạng thái xử lý
                </Button>
                <Button
                  startIcon={<IconifyIcon icon='healthicons:excel-logo' />}
                  variant='contained'
                  color='primary'
                  onClick={() => handleExportExcel(selectedCards, startDate, endDate, monthNumber)}
                  disabled={selectedCards.length === 0}
                  sx={{ ml: 2 }}
                >
                  Xuất file Excel
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant='h5'>Từ ngày {dayjs(startDate).format('DD/MM/YYYY')}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='h5'>Đến ngày {dayjs(endDate).format('DD/MM/YYYY')}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <AnimatePresence mode='sync'>
            {Data?.data?.map((item, index) => (
              <Grid
                key={item?.seller?._id || index}
                item
                xs={12}
                md={3}
                sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', position: 'relative' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: index * 0.2 }}
                  layout
                  style={{ width: '100%' }}
                >
                  <PaymentCard
                    key={item.subOrdersPaid[0]}
                    payment={item}
                    isSelected={selectedCards.some(selected => selected?.seller?._id === item?.seller?._id)}
                    onSelect={() => handleCardSelect(item)}
                  />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </DatePickerWrapper>
    </>
  )
}
