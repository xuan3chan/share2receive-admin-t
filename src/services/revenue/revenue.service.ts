import axiosClient from 'src/lib/axios'
import { RevenueList } from 'src/types/revenue/revenueType'

const revenueService = {
  getRevenue: async (page?: number, limit?: number, filterBy?: string, filterValue?: string): Promise<RevenueList> => {
    const params = {
      ...(filterValue && { filterValue }),
      ...(filterBy && { filterBy }),
      ...(limit && { limit }),
      ...(page && { page })
    }

    const response: RevenueList = await axiosClient.get('/api/revenue/get-revenue-For-manager', { params })

    return response
  }
}

export default revenueService
