import { create } from 'zustand'
import { Product } from 'src/types/product/productType'

interface ProductStore {
  products: Product[]
  product: Product
  openDeleteProduct: boolean
  openUpdateProduct: boolean
  openViewProduct: boolean
  openCreateProduct: boolean
  openApproveProduct: boolean
  openBlockProduct: boolean
  openUnblockProduct: boolean
  setProducts: (products: Product[]) => void
  setProduct: (product: Product) => void
  setOpenDeleteProduct: (open: boolean) => void
  setOpenUpdateProduct: (open: boolean) => void
  setOpenViewProduct: (open: boolean) => void
  setOpenCreateProduct: (open: boolean) => void
  setOpenApproveProduct: (open: boolean) => void
  setOpenBlockProduct: (open: boolean) => void
  setOpenUnblockProduct: (open: boolean) => void
}

export const useProductStore = create<ProductStore>(set => ({
  products: [],
  product: {} as Product,
  openDeleteProduct: false,
  openUpdateProduct: false,
  openViewProduct: false,
  openCreateProduct: false,
  openApproveProduct: false,
  openBlockProduct: false,
  openUnblockProduct: false,
  setProducts: products => set({ products }),
  setProduct: product => set({ product }),
  setOpenDeleteProduct: openDeleteProduct => set({ openDeleteProduct }),
  setOpenUpdateProduct: openUpdateProduct => set({ openUpdateProduct }),
  setOpenViewProduct: openViewProduct => set({ openViewProduct }),
  setOpenCreateProduct: openCreateProduct => set({ openCreateProduct }),
  setOpenApproveProduct: openApproveProduct => set({ openApproveProduct }),
  setOpenBlockProduct: openBlockProduct => set({ openBlockProduct }),
  setOpenUnblockProduct: openUnblockProduct => set({ openUnblockProduct })
}))
