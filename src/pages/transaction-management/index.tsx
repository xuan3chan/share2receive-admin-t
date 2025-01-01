import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Select,
  MenuItem,
  Pagination,
  Paper,
  Popover,
  IconButton,
  TableSortLabel
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

import { useState, useEffect } from 'react'
import transactionService from 'src/services/transaction/transaction.service'
import { useRouter } from 'next/router'
import { useDebounce } from 'use-debounce'
import { Transaction } from 'src/types/transactionType/transactionType'
import { formatPrice, formatDate, truncateString } from 'src/helpers'

const pathname = '/transaction-management'

const TransactionManagement = () => {
  const router = useRouter()
  const [searchKeyInput, setSearchKeyInput] = useState('')

  const [debouncedSearchKey] = useDebounce(searchKeyInput, 800)
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pageCount, setPageCount] = useState(0)

  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({})
  const [noteAnchorEl, setNoteAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({})

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

  const handleNotePopoverOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setNoteAnchorEl(prev => ({
      ...prev,
      [id]: event.currentTarget
    }))
  }

  const handleNotePopoverClose = (id: string) => {
    setNoteAnchorEl(prev => ({
      ...prev,
      [id]: null
    }))
  }

  useEffect(() => {
    transactionService.getAllTransaction(page, limit, sortBy, sortOrder, debouncedSearchKey).then(data => {
      if (data) {
        setTransactions(data?.data)
        setPageCount(Math.ceil((data?.total || 0) / limit))
      }
    })
  }, [page, limit, sortBy, sortOrder, debouncedSearchKey])

  const handlePageChange = (e: any, value: any) => {
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        page: value,
        limit: limit // giữ nguyên giá trị pageLimit
      }
    })
  }

  const handlePageLimitChange = (e: { target: { value: any } }) => {
    const newLimit = e.target.value
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        limit: newLimit,
        page: 1 // reset về page 1 khi thay đổi pageLimit
      }
    })
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Typography variant='h3'>Danh sách giao dịch</Typography>} />
          <CardContent>
            <Grid container>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  placeholder='Tìm kiếm giao dịch'
                  fullWidth
                  label='Tìm kiếm'
                  variant='outlined'
                  onChange={e => {
                    const newSearchKey = e.target.value
                    setSearchKeyInput(newSearchKey)
                    router.push({
                      pathname: pathname,
                      query: {
                        ...searchParams, // giữ các giá trị searchParams hiện tại
                        search: newSearchKey,
                        page: 1 // reset về page 1 khi thay đổi searchKey
                      }
                    })
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ mt: 2 }} />
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'transId'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('transId')}
                    >
                      Mã giao dịch
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'userId'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('userId')}
                    >
                      Người thực hiện giao dịch
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'orderId'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('orderId')}
                    >
                      Mã yêu cầu
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'amount'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('amount')}
                    >
                      Số tiền
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'orderInfo'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('orderInfo')}
                    >
                      Ghi chú chuyến khoản
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'orderType'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('orderType')}
                    >
                      Phương thức thanh toán
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'payType'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('payType')}
                    >
                      Phương thức chuyển khoản
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('createdAt')}
                    >
                      Ngày chuyển khoản
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.transId}</TableCell>
                    <TableCell>
                      {`${transaction.userId.firstname} ${transaction.userId.lastname}`}
                      <IconButton size='small' onClick={e => handlePopoverOpen(e, transaction._id)}>
                        <Icon icon='mdi:information-outline' />
                      </IconButton>
                      <Popover
                        open={Boolean(anchorEl[transaction._id])}
                        anchorEl={anchorEl[transaction._id]}
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
                        onClose={() => handlePopoverClose(transaction._id)}
                      >
                        <div
                          style={{
                            padding: 10
                          }}
                        >
                          <Typography>
                            <p>
                              Email: <span style={{ color: '#1fa32a' }}>{transaction.userId.email}</span>
                            </p>
                            <p>
                              Số điện thoại: <span style={{ color: '#1fa32a' }}>{transaction.userId.phone}</span>
                            </p>
                            <p>
                              Địa chỉ: <span style={{ color: '#1fa32a' }}>{transaction.userId.address}</span>
                            </p>
                          </Typography>
                        </div>
                      </Popover>
                    </TableCell>
                    <TableCell>{transaction.orderId}</TableCell>
                    <TableCell>{formatPrice(transaction.amount)}đ</TableCell>
                    <TableCell>
                      {truncateString(transaction.orderInfo, 20)}
                      <IconButton size='small' onClick={e => handleNotePopoverOpen(e, `note-${transaction._id}`)}>
                        <Icon icon='mdi:information-outline' />
                      </IconButton>
                      <Popover
                        open={Boolean(noteAnchorEl[`note-${transaction._id}`])}
                        anchorEl={noteAnchorEl[`note-${transaction._id}`]}
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
                        onClose={() => handleNotePopoverClose(`note-${transaction._id}`)}
                      >
                        <div style={{ padding: 10, maxWidth: 300 }}>
                          <Typography>{transaction.orderInfo}</Typography>
                        </div>
                      </Popover>
                    </TableCell>
                    <TableCell>{transaction.orderType}</TableCell>
                    <TableCell>{transaction.payType}</TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <Grid
            container
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100px' }}
          >
            <Grid
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 5
              }}
            >
              <Typography mr={2} variant='body1'>
                Số bản ghi mỗi trang:{' '}
              </Typography>
              <Select size='small' value={limit} onChange={handlePageLimitChange}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Grid>
            <Grid>
              <Pagination count={pageCount} page={page} onChange={handlePageChange} color='primary' />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

TransactionManagement.acl = {
  action: 'read',
  subject: 'transaction'
}
export default TransactionManagement
