import { Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material'
import { formatDate } from 'src/helpers'
import { Revenue } from 'src/types/revenue/revenueType'
import { useRouter } from 'next/router'

export default function TableData({ data }: { data: Revenue[] }) {
  const router = useRouter()
  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                fontSize: '20px'
              }}
              width={50}
              align='center'
            >
              STT
            </TableCell>
            <TableCell
              style={{
                fontSize: '20px'
              }}
              width={100}
              align='center'
            >
              Người dùng
            </TableCell>
            <TableCell
              style={{
                fontSize: '20px'
              }}
              width={120}
              align='center'
            >
              Số kim cương
            </TableCell>
            <TableCell
              style={{
                fontSize: '20px'
              }}
              width={100}
              align='center'
            >
              Hình thức
            </TableCell>
            <TableCell
              style={{
                fontSize: '20px'
              }}
              width={100}
              align='center'
            >
              Ngày tạo
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <>
                <TableRow key={row._id}>
                  <TableCell
                    sx={{
                      fontSize: '16px'
                    }}
                    align='center'
                  >
                    {stt}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '16px'
                    }}
                    align='center'
                  >
                    {row.userId.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '16px'
                    }}
                    align='center'
                  >
                    <p>{row.amount} Kim cương</p>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '16px'
                    }}
                    align='center'
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      <p
                        style={{
                          width: 'fit-content',
                          display: 'flex',
                          padding: '5px',
                          borderRadius: '5px',
                          color:
                            row.description === 'buy'
                              ? '#F6465D'
                              : row.description === 'sale'
                              ? '#0ECB81'
                              : row.description === 'promotion'
                              ? '#FFC107'
                              : '#2196F3',
                          backgroundColor:
                            row.description === 'buy'
                              ? '#F6465D4d'
                              : row.description === 'sale'
                              ? '#0ECB814d'
                              : row.description === 'promotion'
                              ? '#FFC1074d'
                              : '#2196F34d'
                        }}
                      >
                        {row.description === 'buy' && 'Chuyển đổi'}
                        {row.description === 'sale' && 'Bán ra'}
                        {row.description === 'promotion' && 'Khuyến mãi'}
                        {row.description === 'product' && 'Đăng bài'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '16px'
                    }}
                    align='center'
                  >
                    {formatDate(row.createdAt)}
                  </TableCell>
                </TableRow>
              </>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
