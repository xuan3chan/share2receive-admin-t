import { Packet } from 'src/types/packet/packetType'
import { create } from 'zustand'

type PacketState = {
  openUpdateModal: boolean
  packet: Packet | null
  openDeleteModal: boolean
  openAddImageModal: boolean

  setOpenUpdateModal: (open: boolean) => void
  setPacket: (packet: Packet | null) => void
  setOpenDeleteModal: (open: boolean) => void
  setOpenAddImageModal: (open: boolean) => void
}

export const usePacketStore = create<PacketState>(set => ({
  openUpdateModal: false,
  openDeleteModal: false,
  packet: null,
  openAddImageModal: false,
  setOpenUpdateModal: open => set({ openUpdateModal: open }),
  setPacket: packet => set({ packet }),
  setOpenDeleteModal: open => set({ openDeleteModal: open }),
  setOpenAddImageModal: open => set({ openAddImageModal: open })
}))
