import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Icon from 'src/@core/components/icon'

import { Typography } from '@mui/material'
import { useAdminStore } from 'src/zustand/admin'
import { useState } from 'react'
import { RowOptions } from './rowaction'
import { Admin } from 'src/types/admin/adminTypes'
import Image from 'next/image'

const TableAdmins = ({ data, page, rowsPerPage }: { data: Admin[]; page: number; rowsPerPage: number }) => {
  const { sortRoles } = useAdminStore()
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof Admin>('accountName')

  const handleRequestSort = (property: keyof Admin) => {
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    setOrder(newOrder)
    setOrderBy(property)
    sortRoles(newOrder, property)
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='body1'>STT</Typography>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'accountName'}
                direction={orderBy === 'accountName' ? order : 'asc'}
                onClick={() => handleRequestSort('accountName')}
              >
                Tài khoản
              </TableSortLabel>
            </TableCell>
            <TableCell>Tên quản trị viên</TableCell>
            <TableCell colSpan={2}>Vai trò</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, index) => {
              const stt = (page - 1) * rowsPerPage + index + 1 // Tính STT dựa trên trang hiện tại và số hàng mỗi trang

              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row._id}>
                  <TableCell>
                    <Typography variant='body1'>{stt}</Typography>
                  </TableCell>
                  <TableCell>
                    {
                      <Typography display={'flex'} variant='body1'>
                        {row.accountName} {row.isBlock && <Icon icon='tabler:lock' color='error' />}
                      </Typography>
                    }
                  </TableCell>
                  <TableCell>
                    <Typography variant='body1'>{row.adminName}</Typography>
                  </TableCell>
                  <TableCell>{<Typography variant='body1'>{row.role.name}</Typography>}</TableCell>
                  <TableCell align='right'>
                    <RowOptions data={row} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant='body1'>Không có quản trị viên nào</Typography>
                <Image src='/images/empty-box.svg' width={350} height={350} alt='no-admin' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableAdmins
