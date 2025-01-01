import { Card, CardHeader, Grid, Typography } from '@mui/material'
import Options from './options'
import PaginationComponent from './pagination'
import { useState } from 'react'
import { Order } from 'src/types/order/orderType'
import { useDebounce } from 'use-debounce'
import { useRouter } from 'next/router'
import transactionService from 'src/services/transaction/transaction.service'
import { ReactDatePickerProps } from 'react-datepicker'
import TableDataReqRefund from './tableDataReqRefund'
import RadioOptions from './radioOptions'
import UpdateStatus from './updateStatus'
import { useOrderStore } from 'src/zustand/order'
import useSWR from 'swr'

const pathname = '/order-management'

export default function TabRefundOrders({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) {
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
  const filterBy = searchParams.filterBy?.toString() || 'requestRefund.status'
  const filterValue = searchParams.filterValue?.toString() || 'pending'

  const [refundOrders, setRefundOrders] = useState<Order[]>([])
  const [pageCount, setPageCount] = useState(1)
  const { setSelectedItemsGlobal } = useOrderStore()

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
        setRefundOrders(res.data)
        setPageCount(res.pagination.totalPages)
        setSelectedItemsGlobal([])
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true
    }
  )

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

  return (
    <>
      <UpdateStatus />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Typography variant='h3'>Danh sách yêu cầu hoàn tiền</Typography>} />
            <Grid item container xs={12} mx={5} mb={5} spacing={2}>
              <Grid item>
                <RadioOptions />
              </Grid>
            </Grid>
            <Options popperPlacement={popperPlacement} reqRefund />
            <TableDataReqRefund orders={refundOrders} />
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
    </>
  )
}
