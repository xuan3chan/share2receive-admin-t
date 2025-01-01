export type Revenue = {
  _id: string
  userId: {
    email: string
  }
  amount: number
  type: 'out' | 'in'
  description: 'sale' | 'buy' | 'promotion' | 'product'
  createdAt: string
}

export type Summarize = {
  totalSale: number
  totalBuy: number
  totalPromotion: number
  totalProduct: number
}

export type RevenueList = {
  data: Revenue[]
  pagination: {
    currentPage: number
    totalPages: number
    totalRevenue: number
  }
  summarize: Summarize
}
