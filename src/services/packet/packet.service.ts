import axiosClient from 'src/lib/axios'
import axiosUpload from 'src/lib/axiosUpload'
import { Packet } from 'src/types/packet/packetType'

type AddPacket = {
  name?: string
  description?: string
  price?: number
  promotionPoint?: number
  status?: string
}

const packetService = {
  getPackets: async (): Promise<Packet[]> => {
    const response: Packet[] = await axiosClient.get('/api/packet')

    return response
  },

  addPacket: async (packet: AddPacket, successCallback?: (res: any) => void, errorCallback?: (error: any) => void) => {
    try {
      return await axiosClient.post('/api/packet', packet).then(res => successCallback && successCallback(res))
    } catch (error: any) {
      if (error) errorCallback && errorCallback(error.response.data.message)
    }
  },

  updatePacket: async (
    packetId: string,
    packet: AddPacket,
    successCallback?: (res: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    try {
      return await axiosClient
        .put(`/api/packet/${packetId}`, packet)
        .then(res => successCallback && successCallback(res))
    } catch (error: any) {
      if (error) errorCallback && errorCallback(error.response.data.message)
    }
  },

  deletePacket: async (
    packetId: string,
    successCallback?: (res: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    try {
      return await axiosClient.delete(`/api/packet/${packetId}`).then(res => successCallback && successCallback(res))
    } catch (error: any) {
      if (error) errorCallback && errorCallback(error.response.data.message)
    }
  },

  uploadImage: async (
    packetId: string,
    image: FormData,
    successCallback?: (res: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    try {
      return await axiosUpload
        .put(`/api/packet/upload/${packetId}`, image)
        .then(res => successCallback && successCallback(res))
    } catch (error: any) {
      if (error) errorCallback && errorCallback(error.response.data.message)
    }
  }
}

export default packetService
