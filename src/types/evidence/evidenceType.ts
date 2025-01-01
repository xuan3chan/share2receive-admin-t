export type Evidence = {
  _id: string
  batchUUID: string
  fileExport: string
  fileExportPath: string
  fileExportId: string
  fileEvidenceId: string
  fileEvidencePath: string
  type: string
  shall: {
    decisionBy: string
    description: string
    _id: string
  }
  createdAt: string
  updatedAt: string
  __v: number
  fileEvidence: string
}

export type EvidenceList = {
  pagination: {
    currentPage: number
    totalPages: number
    total: number
  }
  evidences: Evidence[]
}

export type AddEvidence = {
  file: File
  description: string
  type: string
}
