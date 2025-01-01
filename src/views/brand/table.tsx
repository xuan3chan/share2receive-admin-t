import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'

import { Typography } from '@mui/material'
import { Brand } from 'src/types/brand/brandTypes'
import { RowOptions } from './rowaction'
import { useRouter } from 'next/router'
import Image from 'next/image'

const pathname = 'brand-management'

const TableBrand = ({ data, page, pageLimit }: { data: Brand[]; page: number; pageLimit: number }) => {
  const router = useRouter()
  const searchParams = router.query

  const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    veryHigh: {
      label: 'Rất cao',
      color: '#750701',
      bgColor: '#7507013d'
    },
    high: {
      label: 'Cao',
      color: '#f44336',
      bgColor: '#f443363d'
    },
    medium: {
      label: 'Trung bình',
      color: '#ff9800',
      bgColor: '#ff98003d'
    },
    low: {
      label: 'Thấp',
      color: '#1fa32a',
      bgColor: '#1fa32a3d'
    },
    default: {
      label: 'Không xác định',
      color: '#1fa32a',
      bgColor: '#1fa32a3d'
    }
  }

  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    active: {
      label: 'Đang hoạt động',
      color: '#1fa32a',
      bgColor: '#1fa32a3d'
    },
    inactive: {
      label: 'Đã khóa',
      color: '#f44336',
      bgColor: '#f443363d'
    }
  }

  const handleSortFieldChange = (field: string) => {
    const currentSortField = searchParams.sortField
    const currentSortOrder = searchParams.sortOrder

    let newSortOrder = 'asc'
    if (currentSortField === field) {
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'
    }

    router.push({
      pathname: pathname,
      query: {
        ...searchParams,
        sortField: field,
        sortOrder: newSortOrder
      }
    })
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>STT</Typography>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'name'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('name')}
              >
                Tên danh mục
              </TableSortLabel>
            </TableCell>
            <TableCell align='left'>
              <TableSortLabel
                active={searchParams.sortField === 'totalProduct'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('totalProduct')}
              >
                Số lượng
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'priority'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('priority')}
              >
                Độ ưu tiên
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'status'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('status')}
              >
                Trạng thái
              </TableSortLabel>
            </TableCell>
            <TableCell colSpan={2}>Hình ảnh</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, index) => {
              const stt = (page - 1) * pageLimit + index + 1

              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row._id}>
                  <TableCell>
                    <Typography>{stt}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.name}</Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography>{row.totalProduct}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: priorityConfig[row.priority || 'default'].color,
                        fontWeight: 500,
                        backgroundColor: priorityConfig[row.priority || 'default'].bgColor,
                        padding: '4px 8px',
                        borderRadius: '5px',
                        width: '100px',
                        textAlign: 'center'
                      }}
                    >
                      {priorityConfig[row.priority || 'default'].label}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: statusConfig[row.status].color,
                        fontWeight: 500,
                        backgroundColor: statusConfig[row.status].bgColor,
                        padding: '4px 8px',
                        borderRadius: '5px',
                        width: '140px',
                        textAlign: 'center'
                      }}
                    >
                      {statusConfig[row.status].label}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <img src={row.imgUrl ? row.imgUrl : '/static/images/placeholder.png'} alt='preview' width='100' />
                  </TableCell>

                  <TableCell align='right'>
                    <RowOptions data={row} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant='body1'>Không có thương hiệu nào</Typography>
                <Image src='/images/empty-box.svg' width={350} height={350} alt='no-brand' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableBrand
