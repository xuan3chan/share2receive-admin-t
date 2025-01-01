export type Admin = {
  _id: string
  accountName: string
  adminName: string
  role: {
    name: string
    _id: string
    permissionID: []
  }

  isBlock: boolean
}

export type ListAdmin = {
  total: number
  admins: Admin[]
}

export type AddAdmin = {
  adminName: string
  password?: string
  roleId: string
}

export type UpdateAdmin = AddAdmin
