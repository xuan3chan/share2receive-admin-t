import { Order } from 'src/types/order/orderType'
import { Payment } from 'src/types/payments/paymentsType'
import { create } from 'zustand'

type OrderState = {
  openViewOrder: boolean
  order: Order | null
  enableButton: boolean
  openUpdate: boolean
  selectedItemsGlobal: Order[]
  orders: Order[]
  pageCount: number
  openDetail: boolean
  selectedPayment: Payment | null
}

type OrderActions = {
  setOpenViewOrder: (open: boolean) => void
  setOrder: (order: Order | null) => void
  setEnableButton: (enable: boolean) => void
  setOpenUpdate: (open: boolean) => void
  setSelectedItemsGlobal: (selectedItems: Order[]) => void
  setOrders: (orders: Order[]) => void
  setPageCount: (pageCount: number) => void
  setOpenDetail: (open: boolean) => void
  setSelectedPayment: (payment: Payment | null) => void
}

export const useOrderStore = create<OrderState & OrderActions>(set => ({
  openViewOrder: false,
  order: null,
  enableButton: false,
  openUpdate: false,
  selectedItemsGlobal: [],
  orders: [],
  pageCount: 1,
  openDetail: false,
  selectedPayment: null,
  setOpenViewOrder: open => set({ openViewOrder: open }),
  setOrder: order => set({ order }),
  setEnableButton: enable => set({ enableButton: enable }),
  setOpenUpdate: open => set({ openUpdate: open }),
  setSelectedItemsGlobal: selectedItems => set({ selectedItemsGlobal: selectedItems }),
  setOrders: orders => set({ orders }),
  setPageCount: pageCount => set({ pageCount }),
  setOpenDetail: open => set({ openDetail: open }),
  setSelectedPayment: payment => set({ selectedPayment: payment })
}))
