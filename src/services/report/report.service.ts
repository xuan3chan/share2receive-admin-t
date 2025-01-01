import axiosClient from 'src/lib/axios'
import { ReportHistory, ReportListOrder, ReportListProduct } from 'src/types/report/reportTypes'

const reportService = {
  getReport: async (page?: number, limit?: number, sortBy?: string, sortOrder?: string, reportType?: string) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(reportType && { reportType })
    }

    const response: ReportListOrder = await axiosClient.get('/api/report', { params })

    return response
  },

  getReportHistory: async (): Promise<ReportHistory[]> => axiosClient.get('/api/report/get-history-report'),

  getReportProduct: async (page?: number, limit?: number, sortBy?: string, sortOrder?: string, reportType?: string) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(reportType && { reportType })
    }

    const response: ReportListProduct = await axiosClient.get('/api/report', { params })

    return response
  },

  warningUser: async (reportId: string, success?: (res: any) => void, errorMessage?: (message: string) => void) => {
    try {
      return await axiosClient.post(`/api/report/warning-user/${reportId}`).then(res => success && success(res))
    } catch (error: any) {
      if (error) {
        errorMessage && errorMessage(error.response?.data.message)
      }
    }
  },

  blockUser: async (reportId: string, success?: (res: any) => void, errorMessage?: (message: string) => void) => {
    try {
      return await axiosClient.patch(`/api/report/block-user/${reportId}`).then(res => success && success(res))
    } catch (error: any) {
      if (error) {
        errorMessage && errorMessage(error.response?.data.message)
      }
    }
  },

  blockProduct: async (reportId: string, success?: (res: any) => void, errorMessage?: (message: string) => void) => {
    try {
      return await axiosClient.patch(`/api/report/block-product/${reportId}`).then(res => success && success(res))
    } catch (error: any) {
      if (error) {
        errorMessage && errorMessage(error.response?.data.message)
      }
    }
  },

  confirmReport: async (
    reportId: string,
    isChecked: string,
    success?: (res: any) => void,
    errorMessage?: (message: string) => void
  ) => {
    try {
      return await axiosClient
        .patch(`/api/report/check-report/${reportId}`, { isChecked })
        .then(res => success && success(res))
    } catch (error: any) {
      if (error) {
        errorMessage && errorMessage(error.response?.data.message)
      }
    }
  }
}

export default reportService
