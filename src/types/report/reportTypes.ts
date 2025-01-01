export type ReportOrder = {
  _id: string
  userId: {
    _id: string
    firstname: string
    lastname: string
    email: string
    address: string
    phone: string
  }
  reportType: 'order'
  targetId: string
  reason: string
  status: string
  createdAt: string
  updatedAt: string
  isChecked: boolean | null
  target: {
    _id: string
    sellerId: {
      _id: string
      firstname: string
      lastname: string
      email: string
      address: string
      isBlock: boolean
      phone: string
    }
    subOrderUUID: string
    subTotal: number
    shippingService: string
    shippingFee: number
    note: string | null
    status: string
    createdAt: string
  }
}

export type ReportProduct = {
  _id: string
  userId: {
    _id: string
    firstname: string
    lastname: string
    email: string
    address: string
    phone: string
  }
  reportType: string
  targetId: string
  reason: string
  status: string
  createdAt: string
  updatedAt: string
  isChecked: boolean
  target: {
    _id: string
    productName: string
    imgUrls: string[]
    userId: {
      _id: string
      firstname: string
      lastname: string
      email: string
      isBlock: boolean
      address: string
    }
    isBlock: boolean
    price: number
  }
}

export type ReportListOrder = {
  totalReports: number
  currentPage: number
  totalPages: number
  data: ReportOrder[]
}

export type ReportHistory = {
  _id: string
  userId: {
    _id: string
    firstname: string
    lastname: string
    email: string
  }
  action: string
  createdAt: string
  updatedAt: string
}

export type ReportListProduct = {
  totalReports: number
  currentPage: number
  totalPages: number
  data: ReportProduct[]
}
