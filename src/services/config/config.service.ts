import axiosClient from 'src/lib/axios'
import axiosUpload from 'src/lib/axiosUpload'
import { ConfigFormType, ConfigType } from 'src/types/config/configType'

const configService = {
  getConfig: async (): Promise<ConfigType> => axiosClient.get('/api/configs'),

  updateConfig: async (
    id: string,
    data: ConfigFormType,
    successCallBack?: (res?: any) => void,
    errorCallBack?: (res?: any) => void
  ): Promise<void> => {
    try {
      return axiosClient.put(`/api/configs/${id}`, data).then(res => {
        if (successCallBack) {
          successCallBack(res)
        }
      })
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.response.data.messages)
      }
    }
  },

  uploadSections: async (
    id: string,
    data: FormData,
    successCallBack?: (res?: any) => void,
    errorCallBack?: (res?: any) => void
  ): Promise<void> => {
    try {
      return axiosUpload.put(`/api/configs/upload/${id}`, data).then(res => {
        if (successCallBack) {
          successCallBack(res)
        }
      })
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.response.data.messages)
      }
    }
  }
}

export default configService
