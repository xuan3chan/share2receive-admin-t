import axiosClient from 'src/lib/axios'
import axiosUpload from 'src/lib/axiosUpload'
import { EvidenceList } from 'src/types/evidence/evidenceType'

const evidenceService = {
  getEvidenceList: async (
    page?: number,
    limit?: number,
    filterBy?: string,
    filterValue?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(filterBy && { filterBy }),
      ...(filterValue && { filterValue }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder })
    }

    const response: EvidenceList = await axiosClient.get('/api/evidence', { params })

    return response
  },

  previewFile: async (file: string): Promise<string> => axiosClient.get(`/api/evidence/preview/${file}`),

  addEvidence: async (data: FormData, successCallback?: (res: any) => void, errorCallback?: (error: any) => void) => {
    try {
      return await axiosUpload.post('/api/evidence', data).then(res => successCallback && successCallback(res))
    } catch (error: any) {
      if (error) errorCallback && errorCallback(error.response.data.message)
    }
  },

  editEvidence: async (
    evidenceId: string,
    data: FormData,
    successCallback?: (res: any) => void,
    errorCallback?: (error: any) => void
  ) => {
    try {
      return await axiosUpload
        .put(`/api/evidence/${evidenceId}`, data)
        .then(res => successCallback && successCallback(res))
    } catch (error) {
      if (error) errorCallback && errorCallback(error)
    }
  }
}
export default evidenceService
