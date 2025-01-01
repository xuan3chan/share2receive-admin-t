export type Brand = {
  _id: string
  name: string
  description: string
  status: string
  imgUrl: string
  totalProduct: number
  priority: string
}

export type BrandList = {
  total: number
  brand: Brand[]
}

export type BrandCreate = {
  name: string
  description: string
  status: string
  priority: 'veryHigh' | 'high' | 'medium' | 'low'
  imgUrl: string
}

export type BrandUpdate = {
  name: string
  description: string
  status: string
  priority: 'veryHigh' | 'high' | 'medium' | 'low'
  imgUrl: string
}
