import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@mui/material'
import { useOrderStore } from 'src/zustand/order'
import Icon from 'src/@core/components/icon'
import { formatDate, getOrderStatusName, getShippingServiceName, formatPrice, getPaymentStatusName } from 'src/helpers'
import Image from 'next/image'

export default function ViewDetail() {
  const { openViewOrder, setOpenViewOrder, order, setOrder } = useOrderStore()

  const onClose = () => {
    setOpenViewOrder(false)
    setOrder(null)
  }

  if (!order) return null

  return (
    <Dialog open={openViewOrder} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>
        <Typography variant='h2'>Chi tiết đơn hàng</Typography>
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <Icon icon='material-symbols:close' />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: 600 }}>Mã đơn hàng</Typography>
            <Typography>{order?.subOrderUUID}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: 600 }}>Ngày đặt hàng</Typography>
            <Typography>{formatDate(order?.orderId.createdAt)}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: 600 }}>Trạng thái thanh toán</Typography>
            <Typography>{getPaymentStatusName(order?.orderId.paymentStatus)}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: 600 }}>Trạng thái đơn hàng</Typography>
            <Typography>{getOrderStatusName(order?.status)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 600 }}>Địa chỉ nhận hàng</Typography>
            <Typography>{`${order?.orderId.userId.firstname} ${order?.orderId.userId.lastname}`}</Typography>
            <Typography>{order?.orderId.userId.email}</Typography>
            <Typography>{order?.orderId.phone}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{order?.orderId.address}</Typography>
          </Grid>
          <Grid item container xs={6} spacing={1} direction='column'>
            <Grid item>
              <Typography sx={{ fontWeight: 600 }}>Phương thức vận chuyển</Typography>
              <Typography>{getShippingServiceName(order?.shippingService)}</Typography>
              <Typography>{formatPrice(order?.shippingFee)}đ</Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ fontWeight: 600 }}>Tổng giá trị sản phẩm</Typography>
              <Typography>{formatPrice(order?.subTotal)}đ</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 600 }}>Người bán</Typography>
            <Typography>{`${order?.sellerId.firstname} ${order?.sellerId.lastname}`}</Typography>
            <Typography>{order?.sellerId.email}</Typography>
            <Typography>{order?.sellerId.phone}</Typography>
            <Typography>{order?.sellerId.address}</Typography>
          </Grid>
          <Grid item container xs={6} spacing={1} direction='column'>
            <Grid item>
              <Typography sx={{ fontWeight: 600 }}>Tổng giá trị đơn hàng</Typography>
              <Typography>{formatPrice(order?.subTotal + order?.shippingFee)}đ</Typography>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Typography sx={{ fontWeight: 600 }}>Đánh giá</Typography>
              {order?.rating ? (
                <Box>
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {order.rating} / 5 <Icon icon='fluent-emoji-flat:star' />
                  </Typography>
                  <Typography>{order.comment}</Typography>
                </Box>
              ) : (
                <Typography>Không có đánh giá</Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>Ghi chú</Typography>
            {order?.note ? (
              <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{order?.note}</Typography>
            ) : (
              <Typography>Không có ghi chú</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 600 }}>Các sản phẩm</Typography>
            <Box>
              {order?.products.map(product => (
                <Box key={product._id} display='flex' alignItems='start' gap={2}>
                  <Box style={{ width: 100, height: 120, position: 'relative' }}>
                    <Image src={product.productId.imgUrls[0]} alt={product.productName} fill />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{product.productName}</Typography>
                    <Box display='flex' alignItems='center' gap={1}>
                      <Typography>Số lượng:</Typography>
                      <Typography>{product.quantity}</Typography>
                    </Box>
                    <Box display='flex' alignItems='center' gap={1}>
                      <Typography>Giá:</Typography>
                      <Typography>{formatPrice(product.price)}đ</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
