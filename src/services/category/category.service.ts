import axiosClient from 'src/lib/axios'
import axiosUpload from 'src/lib/axiosUpload'
import { CategoryList } from 'src/types/category/categoryTypes'

const categoryService = {
  // ** Get all categories
  getAll: async (
    page?: number,
    limit?: number,
    searchKey?: string,
    sortField?: string,
    sortOrder?: string
  ): Promise<CategoryList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey }),
      ...(sortField && { sortField }),
      ...(sortOrder && { sortOrder })
    }
    const res: CategoryList = await axiosClient.get('/api/category', { params })

    return res
  },

  // ** Create new category
  create: async (data: FormData): Promise<void> => await axiosUpload.post('/api/category', data),

  // ** Update category
  update: async (id: string, data: FormData) => {
    const res = await axiosUpload.put(`/api/category/${id}`, data)

    return res?.data
  },

  // ** Delete category
  delete: (id: string) => axiosClient.delete(`/api/category/${id}`)
}

export default categoryService
