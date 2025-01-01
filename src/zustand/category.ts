import { create } from 'zustand'
import { Category } from 'src/types/category/categoryTypes'

interface CategoryStore {
  categories: Category[]
  category: Category
  openDeleteCategory: boolean
  openUpdateCategory: boolean
  openViewCategory: boolean
  openCreateCategory: boolean
  setCategories: (categories: Category[]) => void
  setCategory: (category: Category) => void
  setOpenDeleteCategory: (open: boolean) => void
  setOpenUpdateCategory: (open: boolean) => void
  setOpenViewCategory: (open: boolean) => void
  setOpenCreateCategory: (open: boolean) => void
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: [],
  category: {} as Category,
  openDeleteCategory: false,
  openUpdateCategory: false,
  openViewCategory: false,
  openCreateCategory: false,
  setCategories: categories => set({ categories }),
  setCategory: category => set({ category }),
  setOpenDeleteCategory: openDeleteCategory => set({ openDeleteCategory }),
  setOpenUpdateCategory: openUpdateCategory => set({ openUpdateCategory }),
  setOpenViewCategory: openViewCategory => set({ openViewCategory }),
  setOpenCreateCategory: openCreateCategory => set({ openCreateCategory })
}))
