import axiosClient from 'src/lib/axios'
import { AddAdmin, ListAdmin, UpdateAdmin } from 'src/types/admin/adminTypes'

const adminService = {
  getAll: async (page?: number, limit?: number, searchKey?: string): Promise<ListAdmin> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey })
    }
    const res = await axiosClient.get('/api/admin/list', { params })

    return res?.data
  },

  add: (admin: AddAdmin) => axiosClient.post('/api/admin', admin),

  update: async (id: string, admin: UpdateAdmin) => {
    const res = await axiosClient.put(`/api/admin/${id}`, admin)

    return res.data
  },

  delete: async (id: string) => {
    const res = await axiosClient.delete(`/api/admin`, {
      data: { id }
    })

    return res.data
  },

  block: async (id: string, isBlocked: boolean) => {
    const res = await axiosClient.patch(`/api/admin/update-block`, {
      id,
      isBlocked
    })

    return res.data
  }
}

export default adminService
