import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import { UserObject } from 'src/types/user/userTypes'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { RowOptions } from './rowaction'
import { useRouter } from 'next/router'
import Image from 'next/image'
import IconifyIcon from 'src/@core/components/icon'

const UserCell = ({ user }: { user: UserObject }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CustomAvatar src={user.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        <Typography
          noWrap
          sx={{
            fontWeight: 500,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {user.firstname + ' ' + user.lastname}
        </Typography>
        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
          {user.email}
        </Typography>
      </Box>
    </Box>
  )
}

export const TableUser = ({ data, page, pageLimit }: { data: UserObject[]; page: number; pageLimit: number }) => {
  const router = useRouter()
  const searchParams = router.query

  const handleDateTime = (time: Date | string) => {
    const dateTime = new Date(time)

    return `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
  }

  const handleSortFieldChange = (field: string) => {
    const currentSortField = searchParams.sortField
    const currentSortOrder = searchParams.sortOrder

    let newSortOrder = 'asc'
    if (currentSortField === field) {
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'
    }

    router.push({
      pathname: '/user-management',
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
            <TableCell>STT</TableCell>
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'firstname'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('firstname')}
              >
                Người dùng
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'wallet'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('wallet')}
              >
                Điểm kim cương
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'averageRating'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('averageRating')}
              >
                Đánh giá trung bình
              </TableSortLabel>
            </TableCell>
            {/* <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'numberOfRating'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('numberOfRating')}
              >
                Lượt đánh giá
              </TableSortLabel>
            </TableCell> */}
            <TableCell>
              <TableSortLabel
                active={searchParams.sortField === 'isBlock'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('isBlock')}
              >
                Trạng thái
              </TableSortLabel>
            </TableCell>
            <TableCell colSpan={2}>
              <TableSortLabel
                active={searchParams.sortField === 'createdAt'}
                direction={searchParams.sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleSortFieldChange('createdAt')}
              >
                Ngày đăng ký
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, index) => {
              const stt = (page - 1) * pageLimit + index + 1

              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row._id}>
                  <TableCell>{stt}</TableCell>
                  <TableCell>
                    <UserCell user={row} />
                  </TableCell>
                  <TableCell style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {row.wallet}
                    <span
                      style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        alt='wallet'
                        width={100}
                        height={100}
                        src='/latest.png'
                        style={{
                          width: '50%',
                          height: '50%'
                        }}
                      />
                    </span>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {row?.averageRating?.toFixed(1) === '0.0' ? '' : row?.averageRating?.toFixed(1)}
                      {row?.averageRating ? (
                        <>
                          <IconifyIcon icon='fluent-emoji-flat:star' color='#FFD700' width={20} height={20} /> (
                          {row?.numberOfRating} đánh giá)
                        </>
                      ) : (
                        'Chưa có đánh giá'
                      )}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {row?.numberOfRating}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <div
                      style={{
                        display: 'flex'
                      }}
                    >
                      <Typography
                        sx={{
                          color: row.isBlock ? 'error.main' : 'success.main',
                          fontWeight: 500,
                          backgroundColor: row.isBlock ? '#fa05223d' : '#0cb31a3d',
                          padding: '4px 8px',
                          borderRadius: '5px'
                        }}
                      >
                        {row.isBlock ? 'Đã khóa' : 'Hoạt động'}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body1'>{handleDateTime(row.createdAt)}</Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <RowOptions data={row} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant='body1'>Không có người dùng nào</Typography>
                <Image src='/images/empty-box.svg' width={350} height={350} alt='no-user' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
