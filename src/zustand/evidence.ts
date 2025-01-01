import { Evidence } from 'src/types/evidence/evidenceType'
import { create } from 'zustand'

type EvidenceState = {
  evidences: Evidence[]
  refundEvidences: Evidence[]
  dataExcel: any[]
  title: string
  pageCount: number
  page: number
  limit: number
  url: string
  openUpdate: boolean
  openAdd: boolean
  evidenceId: string
  openShare: boolean
}

type EvidenceAction = {
  setEvidences: (evidences: Evidence[]) => void
  setRefundEvidences: (evidences: Evidence[]) => void
  setDataExcel: (dataExcel: any[]) => void
  setTitle: (title: string) => void
  setPageCount: (pageCount: number) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setUrl: (url: string) => void
  toggleOpenAdd: () => void
  toggleOpenUpdate: () => void
  setEvidenceId: (evidenceId: string) => void
  toggleOpenShare: () => void
}

export const useEvidenceStore = create<EvidenceState & EvidenceAction>(set => ({
  evidences: [],
  refundEvidences: [],
  dataExcel: [],
  title: '',
  pageCount: 0,
  page: 1,
  limit: 10,
  url: '',
  openAdd: false,
  openUpdate: false,
  evidenceId: '',
  openShare: false,
  setEvidences: (evidences: Evidence[]) => set({ evidences }),
  setRefundEvidences: (evidences: Evidence[]) => set({ refundEvidences: evidences }),
  setDataExcel: (dataExcel: any[]) => set({ dataExcel }),
  setTitle: (title: string) => set({ title }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPage: (page: number) => set({ page }),
  setLimit: (limit: number) => set({ limit }),
  setUrl: (url: string) => set({ url }),
  toggleOpenAdd: () => set(state => ({ openAdd: !state.openAdd })),
  toggleOpenUpdate: () => set(state => ({ openUpdate: !state.openUpdate })),
  setEvidenceId: (evidenceId: string) => set({ evidenceId }),
  toggleOpenShare: () => set(state => ({ openShare: !state.openShare }))
}))
