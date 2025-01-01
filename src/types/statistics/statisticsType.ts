export type StatisticsRegisterType = {
  time: string
  count: number
}

export type StatisticsData = {
  date: string
  promotionAmount: number
  saleAmount: number
  buyAmount: number
  productAmount: number
}

export type DailyDetails = {
  date: string
  paidUUIDs: string[]
  refundedUUIDs: string[]
  summary: {
    totalSubTotal: number
    totalShippingFee: number
    totalRefund: number
    totalPaid: number
    totalCompletedOrders: number
    totalRefundedOrders: number
    totalCanceledOrders: number
  }
}

export type StatisticsOrderType = {
  dailyDetails: DailyDetails[]
  allSummary: {
    totalSubTotal: number
    totalShippingFee: number
    totalRefund: number
    totalPaid: number
    totalCompletedOrders: number
    totalRefundedOrders: number
    totalCanceledOrders: number
  }
}

export type StatisticsRevenueType = {
  data: StatisticsData[]
  summarize: {
    totalPromotion: number
    totalSale: number
    totalBuy: number
    totalProduct: number
  }
}

export type StatisticsEcoWeightType = {
  totalWeight: number
}
