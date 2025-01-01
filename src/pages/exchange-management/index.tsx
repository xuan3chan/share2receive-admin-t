import {
  Card,
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
import transactionService from 'src/services/transaction/transaction.service'
import { Exchange } from 'src/types/exchange/exchangeType'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { truncateString } from 'src/helpers'
import { getExchangeStatusName } from 'src/helpers'

const pathname = '/exchange-management'

const ExchangeManagement = () => {
  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [pageCount, setPageCount] = useState(1)
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
    transactionService.getExchangeList(page, limit, sortBy, sortOrder).then(data => {
      if (data) {
        setExchanges(data.data)
        setPageCount(Math.ceil((data?.total || 0) / limit))
      }
    })
  }, [page, limit, sortBy, sortOrder])

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

  console.log('exchanges', exchanges)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Typography variant='h3'>Danh sách các trao đổi</Typography>} />
          <Divider />
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'requesterId'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('requesterId')}
                    >
                      Người thực hiện trao đổi
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'receiverId'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('receiverId')}
                    >
                      Người nhận trao đổi
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'requestProduct'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('requestProduct')}
                    >
                      Sản phẩm trao đổi
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'receiveProduct'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('receiveProduct')}
                    >
                      Sản phẩm nhận
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'allExchangeStatus'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortFieldChange('allExchangeStatus')}
                    >
                      Trạng thái
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exchanges.map(exchange => (
                  <TableRow key={exchange._id}>
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {' '}
                          {`${exchange.requesterId.firstname} ${exchange.requesterId.lastname}`}
                        </p>
                        <p style={{ margin: 0 }}>{exchange.requesterId.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* <p style={{ display: 'flex', alignItems: 'center' }}>
                        {`${exchange.receiverId.firstname} ${exchange.receiverId.lastname}`}
                        <IconButton size='small' onClick={e => handleRecInforPopoverOpen(e, exchange._id)}>
                          <Icon icon='mdi:information-outline' fontSize={16} />
                        </IconButton>
                        <Popover
                          open={Boolean(recInfor[exchange._id])}
                          anchorEl={recInfor[exchange._id]}
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
                          onClose={() => handleRecInforPopoverClose(exchange._id)}
                        >
                          <div style={{ padding: 10 }}>
                            <Typography>
                              Họ tên: {` ${exchange.receiverId.firstname} ${exchange.receiverId.lastname}`}
                            </Typography>
                            <Typography>Email: {`${exchange.receiverId.email}`}</Typography>
                            {exchange.ratings.requesterRating && (
                              <>
                                <Typography>
                                  <span style={{ display: 'flex', alignItems: 'center' }}>
                                    Được đánh giá: {`${exchange.ratings.requesterRating.rating}`}{' '}
                                    <Icon icon='fluent-emoji-flat:star' fontSize={16} />
                                  </span>
                                </Typography>
                                <Typography>Nhận xét: {`${exchange.ratings.requesterRating.comment}`}</Typography>
                              </>
                            )}
                          </div>
                        </Popover>
                      </p> */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {`${exchange.receiverId.firstname} ${exchange.receiverId.lastname}`}
                        </p>
                        <p style={{ margin: 0 }}>{exchange.receiverId.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p style={{ display: 'flex', alignItems: 'center' }}>
                        {truncateString(exchange.requestProduct.requesterProductId.productName, 15)}
                        <IconButton size='small' onClick={e => handlePopoverOpen(e, exchange._id)}>
                          <Icon icon='mdi:information-outline' fontSize={16} />
                        </IconButton>
                        <Popover
                          open={Boolean(anchorEl[exchange._id])}
                          anchorEl={anchorEl[exchange._id]}
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
                          onClose={() => handlePopoverClose(exchange._id)}
                        >
                          <div
                            style={{
                              padding: 10
                            }}
                          >
                            <Typography>
                              <p>
                                Tên sản phẩm:{' '}
                                <span style={{ color: '#1fa32a' }}>
                                  {exchange.requestProduct.requesterProductId.productName}
                                </span>
                              </p>
                            </Typography>
                          </div>
                        </Popover>
                      </p>
                    </TableCell>
                    <TableCell>
                      <p style={{ display: 'flex', alignItems: 'center' }}>
                        {truncateString(exchange.receiveProduct.receiverProductId.productName, 15)}
                        <IconButton size='small' onClick={e => handleNotePopoverOpen(e, `note-${exchange._id}`)}>
                          <Icon icon='mdi:information-outline' fontSize={16} />
                        </IconButton>
                        <Popover
                          open={Boolean(noteAnchorEl[`note-${exchange._id}`])}
                          anchorEl={noteAnchorEl[`note-${exchange._id}`]}
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
                          onClose={() => handleNotePopoverClose(`note-${exchange._id}`)}
                        >
                          <div
                            style={{
                              padding: 10
                            }}
                          >
                            <Typography>{exchange.receiveProduct.receiverProductId.productName}</Typography>
                          </div>
                        </Popover>
                      </p>
                    </TableCell>
                    <TableCell>{getExchangeStatusName(exchange.allExchangeStatus)}</TableCell>
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

ExchangeManagement.acl = {
  action: 'read',
  subject: 'exchange'
}
export default ExchangeManagement
