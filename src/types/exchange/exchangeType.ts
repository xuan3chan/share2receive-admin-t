export type Exchange = {
  _id: string
  requesterId: {
    _id: string
    firstname: string
    lastname: string
    email: string
  }
  receiverId: {
    _id: string
    firstname: string
    lastname: string
    email: string
  }
  requestProduct: {
    requesterProductId: {
      _id: string
      productName: string
    }
    size: string
    colors: string
    amount: number
    _id: string
  }
  receiveProduct: {
    receiverProductId: {
      _id: string
      productName: string
    }
    size: string
    colors: string
    amount: number
    _id: string
  }
  allExchangeStatus: string
  shippingMethod: string
  note: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
  receiverStatus: {
    exchangeStatus: string
    confirmStatus: null
    statusDate: string
    _id: string
  }
  requestStatus: {
    exchangeStatus: string
    confirmStatus: null
    statusDate: string
    _id: string
  }
  ratings: {
    requesterRating: {
      _id: string
      userId: string
      targetId: string
      targetType: string
      rating: number
      comment: string
      createdAt: string
      updatedAt: string
    } | null
    receiverRating: {
      _id: string
      userId: string
      targetId: string
      targetType: string
      rating: number
      comment: string
      createdAt: string
      updatedAt: string
    } | null
  }
}

export type ExchangeList = {
  data: Exchange[]
  total: number
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}
