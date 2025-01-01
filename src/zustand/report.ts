import { create } from 'zustand'
import { ReportOrder, ReportProduct, ReportListOrder, ReportListProduct } from 'src/types/report/reportTypes'

type ReportStore = {
  reportOrder: ReportOrder[]
  reportProduct: ReportProduct[]
  listReportOrder: ReportListOrder
  listReportProduct: ReportListProduct
  report: ReportOrder
  report2: ReportProduct
  openBlockOrder: boolean
  openUnblockOrder: boolean
  openBlockProduct: boolean
  openUnblockProduct: boolean
  openWarningUser: boolean
  openBlockUser: boolean
  openUnblockUser: boolean
  openUnblockUserProduct: boolean
  openBlockUserProduct: boolean
}

type ReportAction = {
  setReportOrder: (reportOrder: ReportOrder[]) => void
  setReportProduct: (reportProduct: ReportProduct[]) => void
  setListReportOrder: (listReportOrder: ReportListOrder) => void
  setListReportProduct: (listReportProduct: ReportListProduct) => void
  setReport: (report: ReportOrder) => void
  setReport2: (report2: ReportProduct) => void
  setOpenBlockOrder: (openBlockOrder: boolean) => void
  setOpenUnblockOrder: (openUnblockOrder: boolean) => void
  setOpenBlockProduct: (openBlockProduct: boolean) => void
  setOpenUnblockProduct: (openUnblockProduct: boolean) => void
  setOpenWarningUser: (openWarningUser: boolean) => void
  setOpenBlockUser: (openBlockUser: boolean) => void
  setOpenUnblockUser: (openUnblockUser: boolean) => void
  setOpenUnblockUserProduct: (openUnblockUserProduct: boolean) => void
  setOpenBlockUserProduct: (openBlockUserProduct: boolean) => void
}

export const useReportStore = create<ReportStore & ReportAction>(set => ({
  reportOrder: [] as ReportOrder[],
  reportProduct: [] as ReportProduct[],
  listReportOrder: {} as ReportListOrder,
  listReportProduct: {} as ReportListProduct,
  report: {} as ReportOrder,
  report2: {} as ReportProduct,
  openBlockOrder: false,
  openUnblockOrder: false,
  openBlockProduct: false,
  openUnblockProduct: false,
  openWarningUser: false,
  openBlockUser: false,
  openUnblockUser: false,
  openUnblockUserProduct: false,
  openBlockUserProduct: false,
  setReportOrder: (reportOrder: ReportOrder[]) => set({ reportOrder }),
  setReportProduct: (reportProduct: ReportProduct[]) => set({ reportProduct }),
  setListReportOrder: (listReportOrder: ReportListOrder) => set({ listReportOrder }),
  setListReportProduct: (listReportProduct: ReportListProduct) => set({ listReportProduct }),
  setReport: (report: ReportOrder) => set({ report }),
  setReport2: (report2: ReportProduct) => set({ report2 }),
  setOpenBlockOrder: (openBlockOrder: boolean) => set({ openBlockOrder }),
  setOpenUnblockOrder: (openUnblockOrder: boolean) => set({ openUnblockOrder }),
  setOpenBlockProduct: (openBlockProduct: boolean) => set({ openBlockProduct }),
  setOpenUnblockProduct: (openUnblockProduct: boolean) => set({ openUnblockProduct }),
  setOpenWarningUser: (openWarningUser: boolean) => set({ openWarningUser }),
  setOpenBlockUser: (openBlockUser: boolean) => set({ openBlockUser }),
  setOpenUnblockUser: (openUnblockUser: boolean) => set({ openUnblockUser }),
  setOpenUnblockUserProduct: (openUnblockUserProduct: boolean) => set({ openUnblockUserProduct }),
  setOpenBlockUserProduct: (openBlockUserProduct: boolean) => set({ openBlockUserProduct })
}))
