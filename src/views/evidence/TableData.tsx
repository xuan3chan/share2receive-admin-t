import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import useSWR from 'swr'
import evidenceService from 'src/services/evidence/evidence.service'
import { useEvidenceStore } from 'src/zustand/evidence'
import { useRouter } from 'next/router'
import { getFileName, formatDate, getFileExtension } from 'src/helpers'
import IconifyIcon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import PaginationComponent from '../order-management/pagination'
import RowActions from './rowAction'

export default function TableData({ filterValue, pathname }: { filterValue: string; pathname: string }) {
  const router = useRouter()
  const searchParams = router.query
  const page = searchParams.page ? Number(searchParams.page) : 1
  const limit = searchParams.limit ? Number(searchParams.limit) : 10
  const filterBy = searchParams.filterBy?.toString() || 'type'
  const filterValues = searchParams.filterValue?.toString() || filterValue
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''
  const { setTitle, setUrl, toggleOpenShare } = useEvidenceStore()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClick1 = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClose1 = () => {
    setAnchorEl1(null)
  }

  const { setRefundEvidences, refundEvidences, pageCount, setPageCount } = useEvidenceStore()

  useSWR(
    ['/api/evidence', page, limit, filterBy, filterValues, sortBy, sortOrder],
    () => evidenceService.getEvidenceList(page, limit, filterBy, filterValues, sortBy, sortOrder),
    {
      onSuccess: res => {
        setRefundEvidences(res.evidences)
        setPageCount(res.pagination.totalPages)
      },
      revalidateOnReconnect: true,
      revalidateOnMount: true
    }
  )

  const handleReadFileExcelFromLink = async (fileUrl: string, title: string) => {
    setTitle(getFileName(title))

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dropbox/get-link?fileId=${fileUrl}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()

    router.push({
      pathname: pathname,
      query: {
        ...searchParams,
        file: data.link
      }
    })
  }

  const handleDownloadFile = async (fileUrl: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dropbox/get-link?fileId=${fileUrl}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()

    router.push(data.link)
  }

  const handleShareFile = async (fileUrl: string) => {
    toggleOpenShare()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dropbox/share-file?filePath=${fileUrl}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    setUrl(data.previewLink)
  }

  const handlePageLimitChange = (e: { target: { value: any } }) => {
    const newLimit = e.target.value
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        limit: newLimit,
        page: 1 // reset về page 1 khi thay đổi pageLimit
      }
    })
  }

  const handlePageChange = (e: any, value: any) => {
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        page: value,
        limit: limit // giữ nguyên giá trị pageLimit
      }
    })
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Mã đối soát</TableCell>
              <TableCell>Tệp đối soát</TableCell>
              <TableCell>Tệp minh chứng</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell colSpan={2}>Ngày cập nhật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refundEvidences.map(evidence => (
              <TableRow key={evidence._id}>
                <TableCell>{evidence.batchUUID}</TableCell>
                <TableCell>
                  <p
                    style={{
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#81BFDA',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      width: 'fit-content',
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap'
                    }}
                    onClick={handleClick}
                  >
                    <span>
                      <IconifyIcon
                        icon={
                          getFileExtension(evidence.fileExportPath) === 'xlsx'
                            ? 'vscode-icons:file-type-excel'
                            : getFileExtension(evidence.fileExportPath) === 'docx'
                            ? 'vscode-icons:file-type-word'
                            : getFileExtension(evidence.fileExportPath) === 'doc'
                            ? 'vscode-icons:file-type-word'
                            : getFileExtension(evidence.fileExportPath) === 'xlx'
                            ? 'vscode-icons:file-type-excel'
                            : getFileExtension(evidence.fileExportPath) === 'pdf'
                            ? 'vscode-icons:file-type-pdf2'
                            : 'vscode-icons:file'
                        }
                      />
                    </span>
                    {getFileName(evidence.fileExportPath)}
                  </p>
                  <Menu
                    keepMounted
                    elevation={0}
                    anchorEl={anchorEl}
                    id='customized-menu'
                    onClose={handleClose}
                    open={Boolean(anchorEl)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    <MenuItem
                      onClick={() => handleReadFileExcelFromLink(evidence.fileExportId, evidence.fileExportPath)}
                    >
                      <ListItemIcon>
                        <IconifyIcon icon='solar:eye-linear' />
                      </ListItemIcon>
                      <ListItemText primary='Xem tệp' />
                    </MenuItem>
                    <MenuItem onClick={() => handleDownloadFile(evidence.fileExportId)}>
                      <ListItemIcon>
                        <IconifyIcon icon='tabler:download' />
                      </ListItemIcon>
                      <ListItemText primary='Tải về' />
                    </MenuItem>
                    <MenuItem onClick={() => handleShareFile(evidence.fileExportPath)}>
                      <ListItemIcon>
                        <IconifyIcon icon='ic:outline-share' />
                      </ListItemIcon>
                      <ListItemText primary='Chia sẻ' />
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell>
                  {evidence.fileEvidencePath ? (
                    <>
                      <p
                        style={{
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          color: '#81BFDA',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          width: 'fit-content',
                          wordBreak: 'break-all',
                          whiteSpace: 'pre-wrap'
                        }}
                        onClick={handleClick1}
                      >
                        <span>
                          <IconifyIcon
                            icon={
                              getFileExtension(evidence.fileExportPath) === 'xlsx'
                                ? 'vscode-icons:file-type-excel'
                                : getFileExtension(evidence.fileExportPath) === 'docx'
                                ? 'vscode-icons:file-type-word'
                                : getFileExtension(evidence.fileExportPath) === 'doc'
                                ? 'vscode-icons:file-type-word'
                                : getFileExtension(evidence.fileExportPath) === 'xlx'
                                ? 'vscode-icons:file-type-excel'
                                : getFileExtension(evidence.fileExportPath) === 'pdf'
                                ? 'vscode-icons:file-type-pdf2'
                                : 'vscode-icons:file'
                            }
                          />
                        </span>
                        {getFileName(evidence.fileEvidencePath || '') || 'Chưa có tệp minh chứng'}
                      </p>
                      <Menu
                        keepMounted
                        elevation={0}
                        anchorEl={anchorEl1}
                        id='customized-menu'
                        onClose={handleClose1}
                        open={Boolean(anchorEl1)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                      >
                        <MenuItem
                          onClick={() =>
                            handleReadFileExcelFromLink(evidence.fileEvidenceId, evidence.fileEvidencePath)
                          }
                        >
                          <ListItemIcon>
                            <IconifyIcon icon='solar:eye-linear' />
                          </ListItemIcon>
                          <ListItemText primary='Xem tệp' />
                        </MenuItem>
                        <MenuItem onClick={() => handleDownloadFile(evidence.fileEvidenceId)}>
                          <ListItemIcon>
                            <IconifyIcon icon='tabler:download' />
                          </ListItemIcon>
                          <ListItemText primary='Tải về' />
                        </MenuItem>
                        <MenuItem onClick={() => handleShareFile(evidence.fileEvidencePath)}>
                          <ListItemIcon>
                            <IconifyIcon icon='ic:outline-share' />
                          </ListItemIcon>
                          <ListItemText primary='Chia sẻ' />
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <p style={{ margin: 0 }}>Chưa có tệp minh chứng</p>
                  )}
                </TableCell>
                <TableCell>
                  <p style={{ margin: 0 }}>{evidence.shall.decisionBy}</p>
                  <p style={{ margin: 0 }}>
                    <span>mô tả: </span>
                    {evidence.shall.description}
                  </p>
                </TableCell>
                <TableCell>{formatDate(evidence.createdAt)}</TableCell>
                <TableCell>{formatDate(evidence.updatedAt)}</TableCell>
                <TableCell>
                  <RowActions data={evidence} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationComponent
        page={page}
        pageCount={pageCount}
        limit={limit}
        handlePageChange={handlePageChange}
        handlePageLimitChange={handlePageLimitChange}
      />
      {/* <Spreadsheet data={data} columnLabels={columnLabels} rowLabels={rowLabels} onChange={setDataExcel} /> */}
    </>
  )
}
