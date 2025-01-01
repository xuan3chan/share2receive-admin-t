import { Typography, Divider, Box } from '@mui/material'
import { useOrderStore } from 'src/zustand/order'

export default function PaymentDetail() {
  const { selectedPayment } = useOrderStore()

  console.log(selectedPayment)

  return (
    <div style={{ width: 500, padding: 20 }}>
      <Typography variant='h2'>Chi tiết thanh toán</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant='h3'>
        Đơn của{' '}
        <span style={{ fontWeight: 600, color: 'green' }}>
          {selectedPayment?.seller.firstname} {selectedPayment?.seller.lastname}
        </span>
      </Typography>
      <Box sx={{ mt: 2, display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Typography variant='h5'>Các đơn đã thanh toán</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {selectedPayment?.subOrdersPaid.map(subOrder => (
              <Typography variant='h6' key={subOrder} sx={{ fontWeight: 600, color: 'green' }}>
                {subOrder}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Typography variant='h5'>Các đơn hàng đã hoàn</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {selectedPayment?.subOrdersRefunded.map(subOrder => (
              <Typography variant='h6' key={subOrder} sx={{ fontWeight: 600, color: 'green' }}>
                {subOrder ? subOrder : 'Không có đơn hàng'}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  )
}
