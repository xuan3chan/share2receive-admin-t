import { Card, CardContent, Typography, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Payment } from 'src/types/payments/paymentsType'
import Avatar from '@mui/material/Avatar'
import { formatPrice } from 'src/helpers'
import IconifyIcon from 'src/@core/components/icon'
import { useOrderStore } from 'src/zustand/order'

export default function PaymentCard({
  payment,
  isSelected,
  onSelect
}: {
  payment: Payment
  isSelected: boolean
  onSelect: () => void
}) {
  const { setOpenDetail, setSelectedPayment } = useOrderStore()

  const handleOpenDetail = (payment: Payment) => {
    setSelectedPayment(payment)
    setOpenDetail(true)
  }

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 3 }}>
        <Checkbox size='small' checked={isSelected} onChange={onSelect} />
        <Tooltip title='Xem chi tiết'>
          <IconButton size='small' onClick={() => handleOpenDetail(payment)}>
            <IconifyIcon icon='fluent:apps-list-detail-20-regular' />
          </IconButton>
        </Tooltip>
      </div>
      <CardContent sx={{ padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* demo avatar */}
            {payment.seller.avatar ? (
              <Avatar src={payment.seller.avatar} />
            ) : (
              <Avatar>
                {payment.seller.firstname.charAt(0)}
                {payment.seller.lastname.charAt(0)}
              </Avatar>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6'>{payment.seller.firstname + ' ' + payment.seller.lastname}</Typography>
              <Typography variant='body2'>{payment.seller.email}</Typography>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <Typography variant='h6'>
            <span style={{ fontWeight: 'bold' }}>Số điện thoại:</span> {payment.seller.phone || 'Chưa cập nhật'}
          </Typography>
          <Typography
            variant='h6'
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>Thông tin ngân hàng:</span>
            {payment.seller.banking ? (
              <Typography variant='body2' sx={{ display: 'flex', flexDirection: 'column', gap: '5px', ml: 2 }}>
                <span> Tên ngân hàng: {payment.seller.banking?.bankingName || 'Chưa cập nhật'}</span>
                <span> Số tài khoản: {payment.seller.banking?.bankingNumber || 'Chưa cập nhật'}</span>
                <span> Chi nhánh: {payment.seller.banking?.bankingBranch || 'Chưa cập nhật'}</span>
                <span> Tên chủ tài khoản: {payment.seller.banking?.bankingNameUser || 'Chưa cập nhật'}</span>
              </Typography>
            ) : (
              <span>Chưa cập nhật</span>
            )}
          </Typography>
          <Typography variant='h6'>
            <span style={{ fontWeight: 'bold' }}>Tổng thanh toán:</span> {formatPrice(payment.totalPaid)}đ
          </Typography>
          <Typography variant='h6'>
            <span style={{ fontWeight: 'bold' }}>Tổng đã hoàn:</span> {formatPrice(payment.totalRefunded)}đ
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}
