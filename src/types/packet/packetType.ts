export type Packet = {
  _id: string
  name: string
  description: string
  price: number
  promotionPoint: number
  image: string | null
  status: string
  createdAt: string | Date
  updatedAt: string | Date
  packetIdUUID: string
}
