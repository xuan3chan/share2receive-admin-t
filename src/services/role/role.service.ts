import axiosClient from 'src/lib/axios'
import { RoleTypes, AddRoleType, UpdateRoleType } from 'src/types/role/roleType'

const roleService = {
  getAll: async (page?: number, limit?: number, searchKey?: string): Promise<RoleTypes> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey })
    }
    const res = await axiosClient.get('/api/role', { params })

    return res?.data
  },

  add: async (role: AddRoleType) => {
    const res = await axiosClient.post('/api/role', role)

    return res.data
  },

  update: async (role: UpdateRoleType) => {
    const res = await axiosClient.put(`/api/role`, role)

    return res.data
  },

  delete: async (id: string) => {
    const res = await axiosClient.delete(`/api/role`, {
      data: { id }
    })

    return res.data
  }
}

export default roleService
