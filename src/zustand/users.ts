import { create } from 'zustand'
import { UserObject } from 'src/types/user/userTypes'
import { UserDataType } from 'src/context/types'

interface UserStore {
  users: UserObject[]
  user: UserObject
  admin: UserDataType | null
  openBlockUser: boolean
  openUnblockUser: boolean
  openDeleteUser: boolean
  getme: boolean
  setUsers: (users: UserObject[]) => void
  setUser: (user: UserObject) => void
  setOpenBlockUser: (open: boolean) => void
  setOpenUnblockUser: (open: boolean) => void
  setOpenDeleteUser: (open: boolean) => void
  setAdmin: (admin: UserDataType | null) => void
  setGetme: (getme: boolean) => void
}

export const useUsersStore = create<UserStore>(set => ({
  users: [],
  user: {} as UserObject,
  openBlockUser: false,
  openUnblockUser: false,
  openDeleteUser: false,
  admin: null,
  getme: false,
  setUsers: users => set({ users }),
  setUser: user => set({ user }),
  setOpenBlockUser: openBlockUser => set({ openBlockUser }),
  setOpenUnblockUser: openUnblockUser => set({ openUnblockUser }),
  setOpenDeleteUser: openDeleteUser => set({ openDeleteUser }),
  setAdmin: admin => set({ admin }),
  setGetme: getme => set({ getme })
}))
