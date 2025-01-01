import { Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { forwardRef, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as XLSX from 'xlsx-js-style'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import IconifyIcon from 'src/@core/components/icon'
import { useOrderStore } from 'src/zustand/order'
import { formatPrice } from 'src/helpers'

const pathname = '/order-management'

export default function Options({
  popperPlacement,
  reqRefund
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
  reqRefund?: boolean
}) {
  const router = useRouter()
  const searchParams = router.query
  registerLocale('vi', vi)
  const { setOpenUpdate, selectedItemsGlobal } = useOrderStore()

  const dateFrom = searchParams.dateFrom?.toString() || ''
  const dateTo = searchParams.dateTo?.toString() || ''
  const filterValue = searchParams.filterValue?.toString() || ''

  const [startDateRange, setStartDateRange] = useState<DateType>(dateFrom ? new Date(dateFrom) : null)
  const [endDateRange, setEndDateRange] = useState<DateType>(dateTo ? new Date(dateTo) : null)

  const handleOnChangeSearch = (e: any) => {
    const newSearch = e.target.value
    router.push({
      pathname: pathname,
      query: { ...searchParams, search: newSearch }
    })
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)

    // Format dates to ISO string
    const dateFrom = start ? format(start, 'yyyy-MM-dd') : ''
    const dateTo = end ? format(end, 'yyyy-MM-dd') : ''

    router.push({
      pathname: pathname,
      query: {
        ...searchParams,
        dateFrom,
        dateTo,
        page: 1 // Reset về trang 1 khi thay đổi filter
      }
    })
  }

  const CustomInput = forwardRef((props: any, ref) => {
    const startDate = props.start ? format(props.start, 'dd/MM/yyyy') : ''
    const endDate = props.end ? ` - ${format(props.end, 'dd/MM/yyyy')}` : ''

    const value = `${startDate}${endDate}`

    return (
      <CustomTextField
        placeholder='Chọn khoảng thời gian'
        fullWidth
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
      />
    )
  })

  const handleExportExcel = () => {
    if (selectedItemsGlobal.length === 0) return

    // Chuyển đổi dữ liệu sang định dạng phù hợp cho Excel
    const excelData = selectedItemsGlobal.map((item, index) => ({
      STT: index + 1,
      'Mã đơn hàng': item.subOrderUUID,
      'Tên ngân hàng': item.requestRefund.bankingName,
      'Số tài khoản': item.requestRefund.bankingNumber,
      'Tên tài khoản': item.requestRefund.bankingNameUser,
      'Chi nhánh ngân hàng': item.requestRefund.bankingBranch,
      'Số tiền': formatPrice(item.subTotal + item.shippingFee) + ' vnđ',
      'Nội dung': `Hoàn tiền + ${item.subOrderUUID}`,
      'Ngày yêu cầu': new Date(item.createdAt).toLocaleDateString('vi-VN')
    }))

    // Header và tiêu đề
    const headerData = [
      ['DANH SÁCH HOÀN TIỀN'], // Tiêu đề chính
      [
        'STT',
        'Mã đơn hàng',
        'Tên ngân hàng',
        'Số tài khoản',
        'Tên tài khoản',
        'Chi nhánh ngân hàng',
        'Số tiền',
        'Nội dung',
        'Ngày yêu cầu'
      ]
    ]

    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.aoa_to_sheet([...headerData, ...excelData.map(Object.values)])

    // Định dạng các cột
    ws['!cols'] = [
      { wch: 5 }, // STT
      { wch: 25 }, // Mã đơn hàng
      { wch: 20 }, // Tên ngân hàng
      { wch: 20 }, // Số tài khoản
      { wch: 25 }, // Tên tài khoản
      { wch: 30 }, // Chi nhánh ngân hàng
      { wch: 15 }, // Số tiền
      { wch: 40 }, // Nội dung
      { wch: 15 } // Ngày yêu cầu
    ]

    // Hợp nhất các ô cho tiêu đề
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]

    // Style cho tiêu đề chính
    ws['A1'].s = {
      font: { bold: true, sz: 20, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: '4472C4' } }
    }

    // Style cho header
    const headerStyle = {
      font: { bold: true, color: { rgb: '000000' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'D9E1F2' } }
    }
    const headers = ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2']
    headers.forEach(cell => {
      ws[cell].s = headerStyle
    })

    // Style cho nội dung (căn giữa và border)
    const dataRange = XLSX.utils.decode_range(ws['!ref'] || '')
    for (let R = 2; R <= dataRange.e.r; ++R) {
      for (let C = 0; C <= dataRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        if (!ws[cellAddress]) continue
        ws[cellAddress].s = {
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          }
        }
      }
    }

    // Tạo workbook và thêm worksheet vào
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Hoàn Tiền')

    // Xuất file Excel
    XLSX.writeFile(wb, `don-hoan-tien-${format(new Date(), 'dd-MM-yyyy')}.xlsx`)
  }

  return (
    <>
      <DatePickerWrapper>
        <Grid item container xs={12} mx={5} mb={5} spacing={2}>
          <Grid item xs={3}>
            <DatePicker
              selectsRange
              locale='vi'
              monthsShown={2}
              endDate={endDateRange}
              selected={startDateRange}
              startDate={startDateRange}
              shouldCloseOnSelect={false}
              id='date-range-picker-months'
              onChange={handleOnChangeRange}
              popperPlacement={popperPlacement}
              customInput={
                <CustomInput
                  label='Chọn khoảng thời gian'
                  end={endDateRange as Date | number}
                  start={startDateRange as Date | number}
                />
              }
            />
          </Grid>
          <Grid item xs={5}>
            <CustomTextField
              fullWidth
              label='Tìm kiếm'
              placeholder='Tìm kiếm đơn hàng'
              onChange={handleOnChangeSearch}
            />
          </Grid>
          {reqRefund && (
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {filterValue !== 'refunded' && filterValue !== 'rejected' && (
                <Button
                  disabled={selectedItemsGlobal.length === 0}
                  variant='contained'
                  color='primary'
                  startIcon={<IconifyIcon icon='mdi:update' />}
                  onClick={() => setOpenUpdate(true)}
                >
                  Cập nhật xử lý
                </Button>
              )}
              {filterValue === 'approved' && (
                <Grid item sx={{ display: 'flex', alignItems: 'flex-end', ml: 1 }}>
                  <Button
                    disabled={selectedItemsGlobal.length === 0}
                    variant='contained'
                    color='primary'
                    startIcon={<IconifyIcon icon='healthicons:excel-logo' />}
                    onClick={handleExportExcel}
                  >
                    Xuất file excel
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </DatePickerWrapper>
    </>
  )
}
