import axiosClient from 'src/lib/axios'
import axiosUpload from 'src/lib/axiosUpload'
import { BrandList } from 'src/types/brand/brandTypes'

const brandService = {
  // ** Get all brands
  getAll: async (
    page?: number,
    limit?: number,
    searchKey?: string,
    sortField?: string,
    sortOrder?: string
  ): Promise<BrandList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey }),
      ...(sortField && { sortField }),
      ...(sortOrder && { sortOrder })
    }
    const res: BrandList = await axiosClient.get('/api/brand', { params })

    return res
  },

  // ** Create new brand
  create: (data: FormData) => axiosUpload.post('/api/brand', data),

  // ** Update brand
  update: (id: string, data: FormData) => axiosUpload.put(`/api/brand/${id}`, data),

  // ** Delete brand
  delete: (id: string) => axiosClient.delete(`/api/brand/${id}`)
}

export default brandService
