import { useOrderStore } from 'src/zustand/order'
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, MenuItem, Button, Grid } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import transactionService from 'src/services/transaction/transaction.service'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

export default function UpdateStatus() {
  const { openUpdate, setOpenUpdate, selectedItemsGlobal, setSelectedItemsGlobal } = useOrderStore()
  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''
  const search = searchParams.search?.toString() || ''
  const dateFrom = searchParams.dateFrom?.toString() || ''
  const dateTo = searchParams.dateTo?.toString() || ''
  const filterBy = searchParams.filterBy?.toString() || ''
  const filterValue = searchParams.filterValue?.toString() || 'pending'
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (filterValue) {
      setStatus(filterValue)
    } else {
      setStatus('pending')
    }
  }, [filterValue])

  const onClose = () => {
    setOpenUpdate(false)
  }

  const onUpdateStatus = async () => {
    if (selectedItemsGlobal.length === 0 || selectedItemsGlobal === null) {
      toast.error('Vui lòng chọn đơn hàng')

      return
    }

    await transactionService.updateStatus(
      selectedItemsGlobal.map(item => item._id),
      status,
      res => {
        setOpenUpdate(false)
        toast.success(res.message)
        mutate([
          '/api/orders/get-order-for-manager',
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          dateFrom,
          dateTo,
          filterBy,
          filterValue
        ])
        setSelectedItemsGlobal([])
      },
      () => {
        toast.error('Cập nhật trạng thái hoàn tiền thất bại')
        setSelectedItemsGlobal([])
        setOpenUpdate(false)
      }
    )
  }

  return (
    <Dialog open={openUpdate} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Typography variant='h2'>Cập nhật trạng thái hoàn tiền</Typography>
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
        <IconifyIcon icon='material-symbols:close' />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>
              Bạn đang chọn {selectedItemsGlobal.length} yêu cầu để cập nhật trạng thái
            </Typography>
            {filterValue === 'pending' && (
              <Typography variant='h4'>Lưu ý: Thao tác này sẽ không thể quay lại trạng thái trước đó</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              placeholder='Chọn trạng thái'
              select
              label='Trạng thái'
              fullWidth
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value='' disabled>
                Chọn trạng thái
              </MenuItem>
              {filterValue === 'pending' && <MenuItem value='pending'>Chờ xử lý</MenuItem>}
              {(filterValue === 'approved' || filterValue === 'pending') && (
                <MenuItem value='approved'>Đang xử lý</MenuItem>
              )}
              <MenuItem value='refunded'>Đã hoàn tiền</MenuItem>
              {filterValue === 'pending' && <MenuItem value='rejected'>Từ chối</MenuItem>}
            </CustomTextField>
          </Grid>
          <Grid item xs={12} textAlign='right'>
            <Button variant='outlined' onClick={onClose} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button variant='contained' onClick={onUpdateStatus}>
              Cập nhật
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
