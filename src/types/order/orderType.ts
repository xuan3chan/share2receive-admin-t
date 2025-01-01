export type Order = {
  _id: string
  orderId: {
    _id: string
    userId: {
      _id: string
      firstname: string
      lastname: string
      email: string
    }
    phone: string
    address: string
    paymentStatus: string
    createdAt: string
  }
  sellerId: {
    _id: string
    firstname: string
    lastname: string
    email: string
    address: string
    phone: string
  }
  subTotal: number
  products: [
    {
      _id: string
      subOrderId: string
      productId: {
        _id: string
        imgUrls: string[]
      }
      productName: string
      quantity: number
      price: number
      size: string
      color: string
    }
  ]
  shippingService: string
  shippingFee: number
  note: null
  requestRefund: {
    status: string
    bankingNumber: string
    bankingName: string
    bankingNameUser: string
    bankingBranch: string
    reason: string
    _id: string
    createdAt: string
    updatedAt: string
  }
  status: string
  createdAt: string
  updatedAt: string
  subOrderUUID: string
  rating: number
  comment: string
}

export type OrderList = {
  data: Order[]
  total: number
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}
