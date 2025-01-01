import { create } from 'zustand'

interface StateUX {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useStateUX = create<StateUX>(set => ({
  loading: false,
  setLoading: loading => set({ loading })
}))
