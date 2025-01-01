import axiosClient from 'src/lib/axios'
import { ExchangeList } from 'src/types/exchange/exchangeType'
import { OrderList } from 'src/types/order/orderType'
import { TransactionList } from 'src/types/transactionType/transactionType'

const transactionService = {
  getExchangeList: async (
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ): Promise<ExchangeList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder })
    }
    const res: ExchangeList = await axiosClient.get('/api/Exchange/get-list-exchange-manage', { params })

    return res
  },

  getAllTransaction: async (
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    search?: string
  ): Promise<TransactionList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(search && { search })
    }
    const res: TransactionList = await axiosClient.get('/api/transaction/get-transaction', { params })

    return res
  },

  getOrderList: async (
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    searchKey?: string,
    dateFrom?: string,
    dateTo?: string,
    filterBy?: string,
    filterValue?: string
  ): Promise<OrderList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(searchKey && { searchKey }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(filterBy && { filterBy }),
      ...(filterValue && { filterValue })
    }
    const res: OrderList = await axiosClient.get('/api/orders/get-order-for-manager', { params })

    return res
  },

  updateStatus: async (
    subOrderIds: string[],
    status: string,
    successCallback?: (res: any) => void,
    errorCallback?: () => void
  ): Promise<any> => {
    try {
      return await axiosClient
        .patch(`/api/orders/update-status-refund`, { subOrderIds, status })
        .then(res => successCallback && successCallback(res))
    } catch (error) {
      if (error) errorCallback && errorCallback()
    }
  }
}

export default transactionService
