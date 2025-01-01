import { StatisticsOrderType, StatisticsRevenueType } from 'src/types/statistics/statisticsType'
import { create } from 'zustand'

type State = {
  statisticsOrder: StatisticsOrderType
  statisticsRevenue: StatisticsRevenueType
}

type Action = {
  setStatisticsOrder: (statisticsOrder: StatisticsOrderType) => void
  setStatisticsRevenue: (statisticsRevenue: StatisticsRevenueType) => void
}

export const useStatisticsOrder = create<State & Action>(set => ({
  statisticsOrder: {} as StatisticsOrderType,
  statisticsRevenue: {} as StatisticsRevenueType,
  setStatisticsOrder: statisticsOrder => set({ statisticsOrder }),
  setStatisticsRevenue: statisticsRevenue => set({ statisticsRevenue })
}))
