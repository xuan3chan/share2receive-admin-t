import { create } from 'zustand'
import { Admin } from 'src/types/admin/adminTypes'
import { Roles } from 'src/types/role/roleType'

interface AdminStore {
  admins: Admin[]
  admin: Admin
  roles: Roles[]
  openAddAdminModal: boolean
  openEditAdminModal: boolean
  openDeleteAdminModal: boolean
  openBlockAdminModal: boolean
  openUnblockAdminModal: boolean
  setAdmin: (admin: Admin) => void
  setAdmins: (admins: Admin[]) => void
  setOpenAddAdminModal: (open: boolean) => void
  setOpenEditAdminModal: (open: boolean) => void
  setOpenDeleteAdminModal: (open: boolean) => void
  sortRoles: (order: 'asc' | 'desc', orderBy: keyof Admin) => void
  setRoles: (roles: Roles[]) => void
  setOpenBlockAdminModal: (open: boolean) => void
  setOpenUnblockAdminModal: (open: boolean) => void
}

export const useAdminStore = create<AdminStore>(set => ({
  admins: [],
  admin: {} as Admin,
  roles: [],
  openAddAdminModal: false,
  openEditAdminModal: false,
  openDeleteAdminModal: false,
  openBlockAdminModal: false,
  openUnblockAdminModal: false,
  setAdmins: admins => set({ admins }),
  setAdmin: admin => set({ admin }),
  setOpenAddAdminModal: openAddAdminModal => set({ openAddAdminModal }),
  setOpenEditAdminModal: openEditAdminModal => set({ openEditAdminModal }),
  setOpenDeleteAdminModal: openDeleteAdminModal => set({ openDeleteAdminModal }),
  sortRoles: (order, orderBy) => {
    set(state => ({
      admins: state.admins?.sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1
        }
      })
    }))
  },
  setRoles: roles => set({ roles }),
  setOpenBlockAdminModal: openBlockAdminModal => set({ openBlockAdminModal }),
  setOpenUnblockAdminModal: openUnblockAdminModal => set({ openUnblockAdminModal })
}))
