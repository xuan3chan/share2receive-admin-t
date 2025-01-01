import evidenceService from 'src/services/evidence/evidence.service'
import { useEvidenceStore } from 'src/zustand/evidence'
import useSWR from 'swr'

const useEvidenceAction = () => {
  const { setEvidences } = useEvidenceStore.getState()

  const { data, error, mutate } = useSWR('/api/evidence', evidenceService.getEvidenceList, {
    onSuccess: res => setEvidences(res.evidences)
  })

  const updateEvidence = async (id: string, updateData: any) => {
    if (!id && !updateData) return

    await evidenceService.editEvidence(
      id,
      updateData,
      () => {
        mutate()
      },
      error => {
        console.log('error', error)
      }
    )
  }

  return {
    evidences: data?.evidences,
    isLoading: !error && !data,
    isError: error,
    updateEvidence
  }
}

export default useEvidenceAction
