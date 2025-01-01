import * as XLSX from 'xlsx-js-style'
import format from 'date-fns/format'
import { Payment } from 'src/types/payments/paymentsType'

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + '...'
}

const getShippingServiceName = (string: string) => {
  switch (string) {
    case 'GHN':
      return 'Giao hàng nhanh'
    case 'GHTK':
      return 'Giao hàng tiết kiệm'
    case 'agreement':
      return 'Theo thỏa thuận'
    default:
      return string
  }
}

const getOrderStatusName = (string: string) => {
  switch (string) {
    case 'pending':
      return 'Chờ xử lý'
    case 'canceled':
      return 'Đã hủy'
    case 'shipping':
      return 'Đang giao hàng'
    case 'completed':
      return 'Đã nhận hàng'
    case 'delivered':
      return 'Đã giao hàng'
    default:
      return string
  }
}

const getRequestRefundStatusName = (string: string) => {
  switch (string) {
    case 'pending':
      return 'Chờ xử lý'
    case 'approved':
      return 'Đang xữ lý'
    case 'refunded':
      return 'Đã hoàn tiền'
    case 'rejected':
      return 'Đã từ chối'
    default:
      return string
  }
}

const getRequestRefundStatusColor = (string: string) => {
  switch (string) {
    case 'pending':
      return '#FAB12F'
    case 'approved':
      return '#80C4E9'
    case 'refunded':
      return '#008000'
    case 'rejected':
      return '#ff0000'
    default:
      return '#000000'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN', { style: 'decimal' })
}

const truncateString = (string: string, maxLength: number) => {
  if (string.length <= maxLength) return string

  return string.slice(0, maxLength) + '...'
}

const getExchangeStatusName = (string: string) => {
  switch (string) {
    case 'pending':
      return 'Chờ xử lý'
    case 'canceled':
      return 'Đã hủy'
    case 'shipping':
      return 'Đang giao hàng'
    case 'completed':
      return 'Đã nhận hàng'
    case 'delivered':
      return 'Đã giao hàng'
    case 'accepted':
      return 'Đã chấp nhận'
    default:
      return string
  }
}

const getPaymentStatusName = (string: string) => {
  switch (string) {
    case 'pending':
      return 'Chờ thanh toán'
    case 'paid':
      return 'Đã thanh toán'
    case 'failed':
      return 'Thanh toán thất bại'
    default:
      return string
  }
}

const getReportStatusName = (string: string) => {
  switch (string) {
    case 'pending':
      return 'Chờ xử lý'
    case 'Processed':
      return 'Đã xử lý'
    default:
      return string
  }
}

const getColorReportStatus = (string: string) => {
  switch (string) {
    case 'pending':
      return '#FAB12F'
    case 'Processed':
      return '#80C4E9'
    default:
      return '#000000'
  }
}

const getFileName = (fileName: string) => {
  return fileName.slice(fileName.lastIndexOf('/') + 1)
}

const getFileExtension = (fileName: string) => {
  return fileName.slice(fileName.lastIndexOf('.') + 1)
}

const handleExportExcel = (selectedCards: Payment[], startDate: string, endDate: string, monthNumber: string) => {
  if (selectedCards.length === 0) return

  const excelData = selectedCards.map((item, index) => ({
    STT: index + 1,
    'Người dùng': item.seller.firstname + ' ' + item.seller.lastname,
    Email: item.seller.email || 'Chưa cập nhật',
    'Số điện thoại': item.seller.phone || 'Chưa cập nhật',
    'Tổng tiền': formatPrice(item.totalPaid) + ' vnđ',
    'Tên ngân hàng': item.seller.banking?.bankingName || 'Chưa cập nhật',
    'Số tài khoản': item.seller.banking?.bankingNumber || 'Chưa cập nhật',
    'Tên tài khoản': item.seller.banking?.bankingNameUser || 'Chưa cập nhật',
    'Chi nhánh ngân hàng': item.seller.banking?.bankingBranch || 'Chưa cập nhật',
    'Nội dung': `Thanh toán cho nhà bán hàng ${item.seller.firstname} ${item.seller.lastname} từ ngày ${startDate} đến ngày ${endDate}`
  }))

  const headerData = [
    [`DANH SÁCH THANH TOÁN CHO NHÀ BÁN HÀNG TỪ ${startDate} ĐẾN ${endDate}`],
    [
      'STT',
      'Người dùng',
      'Email',
      'Số điện thoại',
      'Tổng tiền',
      'Tên ngân hàng',
      'Số tài khoản',
      'Tên tài khoản',
      'Chi nhánh ngân hàng',
      'Nội dung'
    ]
  ]

  const ws = XLSX.utils.aoa_to_sheet([...headerData, ...excelData.map(Object.values)])

  ws['!cols'] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
    { wch: 80 }
  ]

  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }]

  ws['A1'].s = {
    font: { bold: true, sz: 20, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: '4472C4' } }
  }

  const headerStyle = {
    font: { bold: true, color: { rgb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: 'D9E1F2' } }
  }

  const headers = ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2']
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
  XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Thanh Toán')

  // Xuất file Excel
  XLSX.writeFile(wb, `thanh-toan-cho-nha-ban-hang-thang-${monthNumber}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`)
}

export {
  truncateText,
  getShippingServiceName,
  getOrderStatusName,
  getExchangeStatusName,
  formatDate,
  formatPrice,
  truncateString,
  getPaymentStatusName,
  getRequestRefundStatusName,
  getRequestRefundStatusColor,
  getReportStatusName,
  getColorReportStatus,
  getFileName,
  getFileExtension,
  handleExportExcel
}
