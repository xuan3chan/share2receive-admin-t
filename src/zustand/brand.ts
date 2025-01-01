import { create } from 'zustand'
import { Brand } from 'src/types/brand/brandTypes'

interface BrandStore {
  brands: Brand[]
  brand: Brand
  openDeleteBrand: boolean
  openUpdateBrand: boolean
  openViewBrand: boolean
  openCreateBrand: boolean
  setBrands: (brands: Brand[]) => void
  setBrand: (brand: Brand) => void
  setOpenDeleteBrand: (open: boolean) => void
  setOpenUpdateBrand: (open: boolean) => void
  setOpenViewBrand: (open: boolean) => void
  setOpenCreateBrand: (open: boolean) => void
}

export const useBrandStore = create<BrandStore>(set => ({
  brands: [],
  brand: {} as Brand,
  openDeleteBrand: false,
  openUpdateBrand: false,
  openViewBrand: false,
  openCreateBrand: false,
  setBrands: brands => set({ brands }),
  setBrand: brand => set({ brand }),
  setOpenDeleteBrand: openDeleteBrand => set({ openDeleteBrand }),
  setOpenUpdateBrand: openUpdateBrand => set({ openUpdateBrand }),
  setOpenViewBrand: openViewBrand => set({ openViewBrand }),
  setOpenCreateBrand: openCreateBrand => set({ openCreateBrand })
}))
