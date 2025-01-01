import { Dialog, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Button, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useRouter } from 'next/router'

export default function ModalUpdate({
  open,
  onClose,
  onUpdate,
  payProcessStatus,
  setPayProcessStatus
}: {
  open: boolean
  onClose: () => void
  onUpdate: () => Promise<void>
  payProcessStatus: string
  setPayProcessStatus: (payProcessStatus: string) => void
}) {
  const router = useRouter()
  const searchParams = router.query
  const payProcessStatusQ = searchParams.payProcessStatus?.toString() || 'pending'

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setPayProcessStatus(payProcessStatusQ)
    }, 0)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h3'>Cập nhật trạng thái thanh toán</Typography>
      </DialogTitle>
      <IconButton
        sx={{
          position: 'absolute',
          right: '8px',
          top: '8px'
        }}
        onClick={handleClose}
      >
        <IconifyIcon icon='mdi:close' />
      </IconButton>
      <DialogContent>
        <CustomTextField
          label='Trạng thái thanh toán'
          select
          fullWidth
          value={payProcessStatus}
          defaultValue={payProcessStatus}
          onChange={e => setPayProcessStatus(e.target.value)}
        >
          <MenuItem value='pending'>Chờ thanh toán</MenuItem>
          <MenuItem value='processing'>Đang xử lý</MenuItem>
          <MenuItem value='completed'>Đã hoàn thành</MenuItem>
        </CustomTextField>
        <Grid container mt={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleClose}>
              Hủy
            </Button>
            <LoadingButton variant='contained' onClick={onUpdate}>
              Cập nhật
            </LoadingButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
