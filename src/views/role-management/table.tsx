import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { TagPermissionNames } from './rowpermission'
import { Roles } from 'src/types/role/roleType'
import { Typography } from '@mui/material'
import { useRoleStore } from 'src/zustand/roles'
import { useState } from 'react'
import { RowOptions } from './rowaction'
import Image from 'next/image'

const TableRoles = ({ data, page, rowsPerPage }: { data: Roles[]; page: number; rowsPerPage: number }) => {
  const { sortRoles } = useRoleStore()
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof Roles>('name')

  const handleRequestSort = (property: keyof Roles) => {
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
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleRequestSort('name')}
              >
                Tên vai trò
              </TableSortLabel>
            </TableCell>
            <TableCell colSpan={2}>Quyền hạn</TableCell>
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
                    <Typography variant='body1'>{row.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <TagPermissionNames data={row} />
                  </TableCell>
                  <TableCell>
                    <RowOptions data={row} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant='body1'>Không có vai trò nào</Typography>
                <Image src='/images/empty-box.svg' width={350} height={350} alt='no-role' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableRoles
