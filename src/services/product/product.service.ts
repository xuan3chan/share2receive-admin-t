import axiosClient from 'src/lib/axios'
import { ProductList, Approve } from 'src/types/product/productType'

const productService = {
  // ** Get all products
  getAll: async (
    page?: number,
    limit?: number,
    searchKey?: string,
    sortField?: string,
    sortOrder?: string
  ): Promise<ProductList> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(searchKey && { searchKey }),
      ...(sortField && { sortField }),
      ...(sortOrder && { sortOrder })
    }
    const res: ProductList = await axiosClient.get('/api/product/list', { params })

    return res
  },

  // ** Approve product
  approve: async (productId: string, data: Approve) => {
    const res = await axiosClient.patch(`/api/product/approve/${productId}`, data)

    return res?.data
  },

  // ** Block product
  block: async (productId: string, isBlock: boolean) => {
    const res = await axiosClient.patch(`/api/product/update-block/${productId}`, { isBlock })

    return res?.data
  }
}

export default productService
