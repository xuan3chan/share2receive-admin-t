import { Card, CardHeader, Grid, Typography } from '@mui/material'
import transactionService from 'src/services/transaction/transaction.service'
import { useRouter } from 'next/router'
import TableData from 'src/views/order-management/tableData'
import PaginationComponent from 'src/views/order-management/pagination'
import ViewDetail from 'src/views/order-management/viewDetail'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import useSWR from 'swr'

// ** Third Party Imports
import { useDebounce } from 'use-debounce'
import Options from 'src/views/order-management/options'
import { ReactDatePickerProps } from 'react-datepicker'
import { styled } from '@mui/material/styles'
import { SyntheticEvent } from 'react-draft-wysiwyg'
import TabRefundOrders from 'src/views/order-management/tabrefundOrders'
import { useOrderStore } from 'src/zustand/order'

const pathname = '/order-management'

const OrderManagement = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''
  const search = searchParams.search?.toString() || ''
  const [searchDebounce] = useDebounce(search, 500)
  const dateFrom = searchParams.dateFrom?.toString() || ''
  const dateTo = searchParams.dateTo?.toString() || ''
  const filterBy = searchParams.filterBy?.toString() || ''
  const filterValue = searchParams.filterValue?.toString() || ''

  const tab = searchParams.tab?.toString() || '1'

  const { orders, pageCount, setOrders, setPageCount } = useOrderStore()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    router.push({ pathname: pathname, query: { ...searchParams, tab: newValue } })
  }

  useSWR(
    [
      '/api/orders/get-order-for-manager',
      page,
      limit,
      sortBy,
      sortOrder,
      searchDebounce,
      dateFrom,
      dateTo,
      filterBy,
      filterValue
    ],
    () =>
      transactionService.getOrderList(
        page,
        limit,
        sortBy,
        sortOrder,
        searchDebounce,
        dateFrom,
        dateTo,
        filterBy,
        filterValue
      ),
    {
      onSuccess: res => {
        if (res) {
          setOrders(res.data)
          setPageCount(res.pagination.totalPages)
        }
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true
    }
  )

  console.log(orders)

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

  // Styled TabList component
  const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
    borderBottom: '0 !important',
    '&, & .MuiTabs-scroller': {
      boxSizing: 'content-box',
      padding: theme.spacing(1.25, 1.25, 2),
      margin: `${theme.spacing(-1.25)} !important`
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    },
    '& .Mui-selected': {
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
      lineHeight: 1,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }))

  return (
    <>
      <ViewDetail />
      <TabContext value={tab}>
        <TabList onChange={handleChange}>
          <Tab label='Đơn hàng' value='1' onClick={() => router.push({ pathname: pathname, query: { tab: '1' } })} />
          <Tab
            label='Yêu cầu hoàn tiền'
            value='2'
            onClick={() => router.push({ pathname: pathname, query: { tab: '2' } })}
          />
        </TabList>
        <TabPanel value='1' sx={{ p: 0 }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title={<Typography variant='h3'>Danh sách đơn hàng</Typography>} />
                <Options popperPlacement={popperPlacement} />
                <TableData orders={orders} />
                <PaginationComponent
                  page={page}
                  pageCount={pageCount}
                  limit={limit}
                  handlePageChange={handlePageChange}
                  handlePageLimitChange={handlePageLimitChange}
                />
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value='2' sx={{ p: 0 }}>
          <TabRefundOrders popperPlacement={popperPlacement} />
        </TabPanel>
      </TabContext>
    </>
  )
}

OrderManagement.acl = {
  action: 'read',
  subject: 'order'
}
export default OrderManagement
