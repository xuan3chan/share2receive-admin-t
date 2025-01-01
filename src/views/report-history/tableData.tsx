import { Table, TableBody, TableHead, TableCell, TableRow, TableContainer, Paper } from '@mui/material'
import { ReportHistory } from 'src/types/report/reportTypes'
import { formatDate } from 'src/helpers'

export default function TableData({ data }: { data: ReportHistory[] }) {
  const getNameActions = (action: string) => {
    switch (action) {
      case 'block_user':
        return 'Khóa người dùng'
      case 'block_product':
        return 'Khóa sản phẩm'
      case 'warning':
        return 'Cảnh báo'
      default:
        return action
    }
  }

  const getColorActions = (action: string) => {
    switch (action) {
      case 'block_user':
        return 'red'
      case 'block_product':
        return 'red'
      case 'warning':
        return 'orange'
      default:
        return 'black'
    }
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người bị thao tác</TableCell>
              <TableCell>Thao tác</TableCell>
              <TableCell>Ngày thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row._id}>
                <TableCell>
                  <p style={{ margin: 0 }}>
                    {row.userId.firstname} {row.userId.lastname}
                  </p>
                  <p style={{ margin: 0 }}>{row.userId.email}</p>
                </TableCell>
                <TableCell>
                  <span style={{ color: getColorActions(row.action) }}>{getNameActions(row.action)}</span>
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
