import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { IconButton, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Typography } from '@mui/material'
import { RowOptions } from './rowaction'
import { useRouter } from 'next/router'
import { Product } from 'src/types/product/productType'
import Image from 'next/image'
import { truncateText } from 'src/helpers'

const pathname = 'product-management'

const TableProduct = ({ data, page, pageLimit }: { data: Product[]; page: number; pageLimit: number }) => {
  const router = useRouter()
  const searchParams = router.query

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

  const formatDate = (date: string | Date) => {
    const d = new Date(date)

    return d.toLocaleDateString('vi-VN')
  }

  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    active: {
      label: 'Hoạt động',
      color: '#1fa32a',
      bgColor: '#1fa32a3d'
    },
    inactive: {
      label: 'Không hoạt động',
      color: '#f44336',
      bgColor: '#f443363d'
    },
    suspend: {
      label: 'Tạm dừng',
      color: '#ff9800',
      bgColor: '#ff98003d'
    }
  }

  const approveStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    approved: {
      label: 'Đã duyệt',
      color: '#1fa32a',
      bgColor: '#1fa32a3d'
    },
    rejected: {
      label: 'Từ chối',
      color: '#f44336',
      bgColor: '#f443363d'
    },
    pending: {
      label: 'Chờ duyệt',
      color: '#ff9800',
      bgColor: '#ff98003d'
    }
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableCell>
            <Typography>STT</Typography>
          </TableCell>
          <TableCell>Ảnh sản phẩm</TableCell>
          <TableCell>
            <TableSortLabel
              active={searchParams.sortField === 'name'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('name')}
            >
              Tên sản phẩm
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={searchParams.sortField === 'type'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('type')}
            >
              Loại sản phẩm
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={searchParams.sortField === 'userName'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('userName')}
            >
              Người đăng
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
          <TableCell>
            <TableSortLabel
              active={searchParams.sortField === 'approved'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('approved')}
            >
              Duyệt
            </TableSortLabel>
          </TableCell>
          <TableCell colSpan={2}>
            <TableSortLabel
              active={searchParams.sortField === 'createdAt'}
              direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
              onClick={() => handleSortFieldChange('createdAt')}
            >
              Ngày tạo
            </TableSortLabel>
          </TableCell>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((product, index) => {
              const stt = (page - 1) * pageLimit + index + 1

              return (
                <>
                  <TableRow
                    sx={{
                      backgroundColor: product?.isBlock ? 'rgba(255, 0, 0, 0.1)' : 'inherit'
                    }}
                    key={product?._id}
                  >
                    <TableCell>{stt}</TableCell>
                    <TableCell>
                      {product?.imgUrls.length > 0 ? (
                        <Image src={product?.imgUrls[0]} width={50} height={50} alt={product?.imgUrls[0]} />
                      ) : (
                        'Không có ảnh'
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {truncateText(product?.productName, 20)}
                        {product?.isBlock && (
                          <Tooltip title='Sản phẩm đã bị chặn' arrow>
                            <IconButton size='small'>
                              <Icon icon='tabler:lock' color='error' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product?.type === 'barter'
                        ? 'Trao đổi'
                        : product?.type === 'sale'
                        ? 'Bán'
                        : product?.type === 'donate'
                        ? 'Quyên tặng'
                        : 'Khác'}
                    </TableCell>
                    <TableCell>{product?.userName}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: statusConfig[product?.status || 'inactive']?.color,
                          fontWeight: 500,
                          backgroundColor: statusConfig[product?.status || 'inactive']?.bgColor,
                          padding: '4px 8px',
                          borderRadius: '5px',
                          width: '140px',
                          textAlign: 'center'
                        }}
                      >
                        {statusConfig[product?.status || 'inactive']?.label}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: approveStatusConfig[product?.approved.approveStatus || 'pending']?.color,
                          fontWeight: 500,
                          backgroundColor: approveStatusConfig[product?.approved.approveStatus || 'pending']?.bgColor,
                          padding: '4px 8px',
                          borderRadius: '5px',
                          width: '140px',
                          textAlign: 'center'
                        }}
                      >
                        {approveStatusConfig[product?.approved.approveStatus || 'pending']?.label}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(product?.createdAt)}</TableCell>
                    <TableCell>
                      <RowOptions data={product} />
                    </TableCell>
                  </TableRow>
                </>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant='body1'>Không có sản phẩm nào</Typography>
                <Image src='/images/empty-box.svg' width={350} height={350} alt='no-product' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableProduct
