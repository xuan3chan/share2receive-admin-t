import { Roles } from 'src/types/role/roleType'
import { create } from 'zustand'

interface RoleStore {
  roles: Roles[]
  role: Roles
  openAddRoleModal: boolean
  openEditRoleModal: boolean
  openDeleteRoleModal: boolean
  setRole: (role: Roles) => void
  setRoles: (roles: Roles[]) => void
  sortRoles: (order: 'asc' | 'desc', orderBy: keyof Roles) => void
  setOpenAddRoleModal: (open: boolean) => void
  setOpenEditRoleModal: (open: boolean) => void
  setOpenDeleteRoleModal: (open: boolean) => void
}

export const useRoleStore = create<RoleStore>(set => ({
  roles: [],
  role: {} as Roles,
  openAddRoleModal: false,
  openEditRoleModal: false,
  openDeleteRoleModal: false,
  setRoles: roles => set({ roles }),
  setRole: role => set({ role }),
  sortRoles: (order, orderBy) => {
    set(state => ({
      roles: state.roles.sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1
        }
      })
    }))
  },
  setOpenAddRoleModal: openAddRoleModal => set({ openAddRoleModal }),
  setOpenEditRoleModal: openEditRoleModal => set({ openEditRoleModal }),
  setOpenDeleteRoleModal: openDeleteRoleModal => set({ openDeleteRoleModal })
}))
