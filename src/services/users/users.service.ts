import axiosClient from 'src/lib/axios'
import { UserList } from 'src/types/user/userTypes'

const userService = {
  // ** Get List User
  getAll: async (
    page?: number,
    limit?: number,
    searchKey?: string,
    sortField?: string,
    sortOrder?: string
  ): Promise<UserList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey }),
      ...(sortField && { sortField }),
      ...(sortOrder && { sortOrder })
    }
    const res = await axiosClient.get('/api/users/list-users', { params })

    return res?.data
  },

  block: async (_id: string, isBlock: boolean) => {
    const res = await axiosClient.patch(`/api/users/update-block-user`, {
      _id,
      isBlock
    })

    return res.data
  },

  delete: async (_id: string) => {
    const res = await axiosClient.delete(`/api/users/delete-user`, {
      data: { _id }
    })

    return res.data
  }
}

export default userService
