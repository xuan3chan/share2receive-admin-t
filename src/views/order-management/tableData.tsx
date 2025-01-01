import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material'
import { formatDate, formatPrice, getOrderStatusName } from 'src/helpers'
import { Order } from 'src/types/order/orderType'
import RowActions from './rowAction'
import { useRouter } from 'next/router'

const pathname = 'order-management'

export default function TableData({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const searchParams = router.query

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

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={searchParams.sortBy === 'subOrderUUID'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('subOrderUUID')}
                >
                  Mã đơn hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={searchParams.sortBy === 'userId'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('userId')}
                >
                  Người đặt hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={searchParams.sortBy === 'sellerId'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('sellerId')}
                >
                  Người bán
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={searchParams.sortBy === 'subTotal'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('subTotal')}
                >
                  Tổng tiền
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={searchParams.sortBy === 'createdAt'}
                  direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleSortFieldChange('createdAt')}
                >
                  Ngày đặt hàng
                </TableSortLabel>
              </TableCell>
              <TableCell colSpan={2}>
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
                <TableCell>{order?.subOrderUUID}</TableCell>
                <TableCell>{order?.orderId?.userId?.firstname + ' ' + order?.orderId?.userId?.lastname}</TableCell>
                <TableCell>{order?.sellerId?.firstname + ' ' + order?.sellerId?.lastname}</TableCell>
                <TableCell>{formatPrice(order?.subTotal + order?.shippingFee)}đ</TableCell>
                <TableCell>{formatDate(order?.createdAt)}</TableCell>
                <TableCell>{getOrderStatusName(order?.status)}</TableCell>
                <TableCell align='right'>
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
