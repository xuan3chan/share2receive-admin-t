import axiosClient from 'src/lib/axios'
import { PaymentList } from 'src/types/payments/paymentsType'

const paymentsService = {
  getPayments: async (
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
    dateFrom?: string,
    dateTo?: string,
    payProcessStatus?: string
  ) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(payProcessStatus && { payProcessStatus })
    }

    const response: PaymentList = await axiosClient.get('/api/orders/get-payment-for-manager', { params })

    return response
  },

  updatePayment: async (
    subOrderIds: string[],
    payProcessStatus: string,
    successCallback?: (res: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    try {
      return await axiosClient
        .patch('/api/orders/update-pay-process-manager', { subOrderIds, payProcessStatus })
        .then(res => successCallback && successCallback(res))
    } catch (error: any) {
      if (error) errorCallback && errorCallback(error.response.data.message)
    }
  }
}

export default paymentsService
