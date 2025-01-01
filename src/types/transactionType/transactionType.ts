export type Transaction = {
  _id: string
  orderS2RId: string
  userId: {
    _id: string
    firstname: string
    lastname: string
    email: string
    address: string
    phone: string
  }
  orderId: string
  amount: number
  orderInfo: string
  orderType: string
  transId: number
  payType: string
  createdAt: string
}

export type TransactionList = {
  data: Transaction[]
  total: number
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}
