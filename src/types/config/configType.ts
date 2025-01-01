export type ConfigType = {
  _id: string
  sectionUrl_1: string
  sectionUrl_2: string
  videoUrl_1: string
  videoUrl_2: string
  valueToPoint: number
  valueToPromotion: number
  reportWarning: number
  reprotBlockerProduct: number
  reportBlockUser: number
  createdAt: string | Date
  updatedAt: string | Date
  valueToCross: number
}

export type ConfigFormType = {
  videoUrl_1?: string
  videoUrl_2?: string
  valueToPoint?: number
  valueToPromotion?: number
  valueToCross?: number
  reportWarning?: number
  reprotBlockerProduct?: number
  reportBlockUser?: number
}
