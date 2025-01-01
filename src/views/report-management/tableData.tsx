import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { IconButton, Popover, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Typography } from '@mui/material'
import { RowOptions } from './rowaction'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { getOrderStatusName, getShippingServiceName } from 'src/helpers'
import { ReportOrder } from 'src/types/report/reportTypes'
import { RessonOrder, RessonProduct } from 'src/constants/resson'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const pathname = 'report-management'

const TableReport = ({
  data,
  handleConfirmReport
}: {
  data: ReportOrder[]
  handleConfirmReport: (id: string, isChecked: string) => Promise<void>
}) => {
  const router = useRouter()
  const searchParams = router.query
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({})

  console.log(data)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(prev => ({
      ...prev,
      [id]: event.currentTarget
    }))
  }

  const handlePopoverClose = (id: string) => {
    setAnchorEl(prev => ({
      ...prev,
      [id]: null
    }))
  }

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

  const formatDate = (date: string | Date) => {
    const d = new Date(date)

    return d.toLocaleDateString('vi-VN')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'decimal' })
  }

  const getReasonLabel = (value: string, type: 'order' | 'product') => {
    const reasonList = type === 'order' ? RessonOrder : RessonProduct
    const reason = reasonList.find(item => item.value === value)

    return reason?.label || value
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableCell>
            <TableSortLabel
              active={searchParams.sortBy === 'userId'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('userId')}
            >
              Người báo cáo
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={searchParams.sortBy === 'subOrderUUID'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('subOrderUUID')}
            >
              Mã hóa đơn
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={searchParams.sortBy === 'reason'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('reason')}
            >
              Lý do
            </TableSortLabel>
          </TableCell>
          <TableCell align='left'>Xác nhận</TableCell>
          <TableCell colSpan={2}>
            <TableSortLabel
              active={searchParams.sortBy === 'createdAt'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('createdAt')}
            >
              Ngày báo cáo
            </TableSortLabel>
          </TableCell>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map(report => {
              return (
                <TableRow key={report._id}>
                  <TableCell>{report?.userId.firstname + ' ' + report?.userId.lastname}</TableCell>
                  <TableCell>
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                      {report?.target.subOrderUUID}
                      <IconButton size='small' onClick={e => handlePopoverOpen(e, report._id)}>
                        <Icon icon='mdi:information-outline' />
                      </IconButton>
                      <Popover
                        open={Boolean(anchorEl[report._id])}
                        anchorEl={anchorEl[report._id]}
                        sx={{
                          pointerEvents: 'auto'
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                        onClose={() => handlePopoverClose(report._id)}
                      >
                        <div
                          style={{
                            padding: 10
                          }}
                        >
                          <Typography>
                            <p>
                              Mã hóa đơn: <span style={{ color: '#1fa32a' }}>{report?.target.subOrderUUID}</span>
                            </p>
                            <p>
                              Người bán:{' '}
                              <span style={{ color: '#1fa32a' }}>
                                {report?.target.sellerId.firstname + ' ' + report?.target.sellerId.lastname}
                              </span>
                            </p>
                            <p>
                              Số điện thoại: <span style={{ color: '#1fa32a' }}>{report?.target.sellerId.phone}</span>
                            </p>
                            <p>
                              Email: <span style={{ color: '#1fa32a' }}>{report?.target.sellerId.email}</span>
                            </p>
                            <p>
                              Địa chỉ:
                              <span style={{ color: '#1fa32a', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {report?.target.sellerId.address}
                              </span>
                            </p>
                            <p>
                              Giá trị đơn hàng:{' '}
                              <span style={{ color: '#1fa32a' }}>{formatPrice(report?.target.subTotal)}đ</span>
                            </p>
                            <p>
                              Dịch vụ vận chuyển:{' '}
                              <span style={{ color: '#1fa32a' }}>
                                {getShippingServiceName(report?.target.shippingService)}
                              </span>
                            </p>
                            <p>
                              Phí vận chuyển:{' '}
                              <span style={{ color: '#1fa32a' }}>{formatPrice(report?.target.shippingFee)}đ</span>
                            </p>
                            <p>
                              Trạng thái đơn hàng:{' '}
                              <span style={{ color: '#1fa32a' }}>{getOrderStatusName(report?.target.status)}</span>
                            </p>
                            <p>
                              Người dùng bị chặn:{' '}
                              <span style={{ color: '#1fa32a' }}>
                                {report?.target.sellerId.isBlock ? 'Đã chặn' : 'Chưa chặn'}
                              </span>
                            </p>
                            <p>
                              Ngày tạo đơn hàng:{' '}
                              <span style={{ color: '#1fa32a' }}>{formatDate(report?.target.createdAt)}</span>
                            </p>
                          </Typography>
                        </div>
                      </Popover>
                    </p>
                  </TableCell>
                  <TableCell>
                    <p style={{ display: 'flex', alignItems: 'center' }}>{getReasonLabel(report?.reason, 'order')}</p>
                  </TableCell>
                  <TableCell align='center'>
                    {report?.isChecked === null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Tooltip title='Xác nhận'>
                          <IconButton color='success' onClick={() => handleConfirmReport(report._id, 'true')}>
                            <IconifyIcon icon='ic:round-check' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Không xác nhận'>
                          <IconButton color='error' onClick={() => handleConfirmReport(report._id, 'false')}>
                            <IconifyIcon icon='ic:round-close' />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                    {report?.isChecked && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          backgroundColor: '#1fa32a3d',
                          width: 'fit-content',
                          padding: '3px 7px',
                          borderRadius: 5
                        }}
                      >
                        <IconifyIcon icon='ic:round-check' style={{ color: '#1fa32a', fontSize: 18 }} />
                        <Typography sx={{ color: '#1fa32a' }}>Đã xác nhận</Typography>
                      </div>
                    )}
                    {report?.isChecked === false && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          width: 'fit-content',
                          padding: '3px 7px',
                          borderRadius: 5,
                          backgroundColor: '#f443363d'
                        }}
                      >
                        <IconifyIcon icon='ic:round-close' style={{ color: '#f44336', fontSize: 18 }} />
                        <Typography sx={{ color: '#f44336' }}>Không xác nhận</Typography>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(report?.createdAt)}</TableCell>
                  <TableCell>
                    <RowOptions data={report} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant='body1'>Không có sản phẩm nào</Typography>
                <Image src='/images/empty-box.svg' width={350} height={350} alt='no-product' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableReport
