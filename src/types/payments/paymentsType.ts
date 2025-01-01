export type Payment = {
  seller: {
    banking: {
      bankingName: string
      bankingNameUser: string
      bankingNumber: string
      bankingBranch: string
    } | null
    _id: string
    firstname: string
    lastname: string
    email: string
    avatar: string
    phone: string
  }
  totalPaid: number
  totalRefunded: number
  subOrdersPaid: string[]
  subOrdersRefunded: string[]
}

export type PaymentList = {
  data: Payment[]
  pagination: {
    currentPage: number
    totalPages: number
    totalSubOrders: number
  }
}
