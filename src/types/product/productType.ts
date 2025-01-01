type ApproveStatus = {
  approveStatus: 'pending' | 'approved' | 'rejected'
  date: string | Date
  decisionBy: string
  description: string
  _id: string
}

export type Product = {
  _id: string
  productName: string
  imgUrls: string[]
  material: string
  userId: string
  userName: string
  categoryName: string
  brandName: string
  approved: ApproveStatus
  isDeleted: boolean
  status: string
  isBlock: boolean
  type: string
  price: number
  tags: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

export type ProductList = {
  total: number
  products: Product[]
}

export type Approve = {
  approveStatus: 'pending' | 'approved' | 'rejected'
  description: string
}
