import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Checkbox
} from '@mui/material'
import { formatDate, formatPrice, getRequestRefundStatusColor, getRequestRefundStatusName } from 'src/helpers'
import { Order } from 'src/types/order/orderType'
import RowActions from './rowAction'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useOrderStore } from 'src/zustand/order'
import IconifyIcon from 'src/@core/components/icon'

const pathname = 'order-management'

export default function TableDataReqRefund({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const searchParams = router.query

  const [expandedReason, setExpandedReason] = useState<string | null>(null)

  const { setSelectedItemsGlobal, selectedItemsGlobal } = useOrderStore()
  const handleSortFieldChange = (field: string) => {
    const currentSortField = searchParams.sortBy
    const currentSortOrder = searchParams.sortOrder

    let newSortOrder = 'asc'
    if (currentSortField === field) {
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'
    }

    router.push({
      pathname: pathname,
      query: {
        ...searchParams,
        sortBy: field,
        sortOrder: newSortOrder
      }
    })
  }

  const handleViewMoreReason = (orderId: string) => {
    setExpandedReason(prev => (prev === orderId ? null : orderId))
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItemsGlobal(orders)
    } else {
      setSelectedItemsGlobal([])
    }
  }

  const handleSelectItem = (order: Order) => {
    const updatedItems = selectedItemsGlobal.includes(order)
      ? selectedItemsGlobal.filter(item => item._id !== order._id)
      : [...selectedItemsGlobal, order]

    setSelectedItemsGlobal(updatedItems)
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={10} sx={{ padding: 0 }} align='left' padding='checkbox'>
                <Checkbox
                  checked={selectedItemsGlobal.length === orders.length}
                  indeterminate={selectedItemsGlobal.length > 0 && selectedItemsGlobal.length < orders.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell width={150} padding='none'>
                <TableSortLabel
                  active={searchParams.sortBy === 'subOrderUUID'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('subOrderUUID')}
                >
                  Mã đơn hàng
                </TableSortLabel>
              </TableCell>
              <TableCell width={150} padding='none'>
                <TableSortLabel
                  active={searchParams.sortBy === 'userId'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('userId')}
                >
                  Người yêu cầu
                </TableSortLabel>
              </TableCell>
              <TableCell width={110} padding='none'>
                <TableSortLabel
                  active={searchParams.sortBy === 'subTotal'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('subTotal')}
                >
                  Tổng tiền
                </TableSortLabel>
              </TableCell>
              <TableCell padding='none'>Thông tin ngân hàng</TableCell>
              <TableCell width={200} padding='none'>
                Lý do
              </TableCell>
              <TableCell width={150} padding='none'>
                <TableSortLabel
                  active={searchParams.sortBy === 'createdAt'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('createdAt')}
                >
                  Thời gian
                </TableSortLabel>
              </TableCell>
              <TableCell colSpan={2} width={140} padding='none' align='center'>
                <TableSortLabel
                  active={searchParams.sortBy === 'status'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('status')}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order?._id}>
                <TableCell width={10} sx={{ padding: 0 }} align='left' padding='checkbox'>
                  <Checkbox checked={selectedItemsGlobal.includes(order)} onChange={() => handleSelectItem(order)} />
                </TableCell>
                <TableCell padding='none'>{order?.subOrderUUID}</TableCell>
                <TableCell padding='none'>
                  {order?.orderId?.userId?.firstname + ' ' + order?.orderId?.userId?.lastname}
                </TableCell>
                <TableCell padding='none'>{formatPrice(order?.subTotal + order?.shippingFee)}đ</TableCell>
                <TableCell padding='none'>
                  <div>
                    <p style={{ margin: 0 }}>Số tài khoản: {order?.requestRefund?.bankingNumber}</p>
                    <p style={{ margin: 0 }}>Tên ngân hàng: {order?.requestRefund?.bankingName}</p>
                    <p style={{ margin: 0 }}>Tên chủ tài khoản: {order?.requestRefund?.bankingNameUser}</p>
                    <p style={{ margin: 0 }}>Chi nhánh: {order?.requestRefund?.bankingBranch}</p>
                  </div>
                </TableCell>
                <TableCell padding='none'>
                  {expandedReason === order?._id
                    ? order?.requestRefund?.reason
                    : `${order?.requestRefund?.reason?.substring(0, 20)}...`}
                  <span
                    style={{ cursor: 'pointer', color: '#477fcc' }}
                    onClick={() => handleViewMoreReason(order?._id)}
                  >
                    {expandedReason === order?._id ? '\n.Thu gọn' : 'Xem thêm'}
                  </span>
                </TableCell>
                <TableCell padding='none'>
                  <div>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                      <IconifyIcon icon='icon-park-outline:dot' />
                      <span>Ngày yêu cầu: {formatDate(order?.requestRefund.createdAt)}</span>
                    </p>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                      <IconifyIcon icon='icon-park-outline:dot' />
                      <span>Ngày cập nhật: {formatDate(order?.requestRefund.updatedAt)}</span>
                    </p>
                  </div>
                </TableCell>
                <TableCell padding='none' align='center'>
                  <span style={{ color: getRequestRefundStatusColor(order?.requestRefund.status), fontWeight: 600 }}>
                    {getRequestRefundStatusName(order?.requestRefund.status)}
                  </span>
                </TableCell>
                <TableCell padding='none' align='right'>
                  <RowActions data={order} />
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align='center'>
                  Không tìm thấy dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
