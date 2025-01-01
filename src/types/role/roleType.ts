export type Roles = {
  icon: string
  color: string
  _id: string
  name: string
  permissionID: number[]
}

export type RoleTypes = {
  total: 29
  roles: Roles[]
}

export type AddRoleType = {
  name: string
  permissionID: number[]
}

export type UpdateRoleType = {
  _id: string
  name: string
  permissionID: number[]
}
