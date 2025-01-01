import axiosClient from 'src/lib/axios'
import {
  StatisticsEcoWeightType,
  StatisticsOrderType,
  StatisticsRegisterType,
  StatisticsRevenueType
} from 'src/types/statistics/statisticsType'

const statisticsService = {
  getStatisticsOrder: async (startDate?: string, endDate?: string, viewBy?: string): Promise<StatisticsOrderType> => {
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(viewBy && { viewBy })
    }
    const res: StatisticsOrderType = await axiosClient.get('/api/statistics/get-static-order', { params })

    return res
  },

  getStatisticsRegister: async (
    startDate?: string,
    endDate?: string,
    viewBy?: string
  ): Promise<StatisticsRegisterType[]> => {
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(viewBy && { viewBy })
    }
    const res: StatisticsRegisterType[] = await axiosClient.get('/api/statistics/get-time-register', { params })

    return res
  },

  getEcoWeight: async (): Promise<StatisticsEcoWeightType> => axiosClient.get('/api/statistics/get-static-eco-all'),

  getStatisticsRevenue: async (
    startDate?: string,
    endDate?: string,
    viewBy?: string,
    dateBy?: string
  ): Promise<StatisticsRevenueType> => {
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(viewBy && { viewBy }),
      ...(dateBy && { dateBy })
    }
    const res: StatisticsRevenueType = await axiosClient.get('/api/statistics/get-static-revenue', { params })

    return res
  }
}

export default statisticsService
