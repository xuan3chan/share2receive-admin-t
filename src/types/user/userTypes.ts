export type UserObject = {
  _id: string
  firstname: string
  lastname: string
  email: string
  avatar: string
  isBlock: boolean
  createdAt: Date | string
  averageRating: number
  numberOfRating: number
  wallet: number
}

export type UserList = {
  total: number
  users: UserObject[]
}
