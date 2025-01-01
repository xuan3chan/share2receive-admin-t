export type Category = {
  _id: string
  name: string
  description: string
  status: string
  priority: string
  type: string
  imgUrl: string
  slug: string
}

export type CategoryList = {
  total: 1
  category: Category[]
}

export type CategoryCreate = {
  name: string
  description: string
  priority: 'veryHigh' | 'high' | 'medium' | 'low'
  status: string
  type: string
  imgUrl: string
}

export type CategoryUpdate = {
  name: string
  description: string
  status: string
  priority: 'veryHigh' | 'high' | 'medium' | 'low'
  type: string
  imgUrl: string
}
