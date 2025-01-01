import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { useAdminStore } from 'src/zustand/admin'
import { Admin } from 'src/types/admin/adminTypes'

export const RowOptions = ({ data }: { data: Admin }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { setOpenEditAdminModal, setAdmin, setOpenDeleteAdminModal, setOpenBlockAdminModal, setOpenUnblockAdminModal } =
    useAdminStore()
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          onClick={() => {
            setOpenEditAdminModal(true)
            setAdmin(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={20} />
          Sửa
        </MenuItem>
        {!data.isBlock ? (
          <MenuItem
            onClick={() => {
              setOpenBlockAdminModal(true)
              setAdmin(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock' fontSize={20} />
            Khóa
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setOpenUnblockAdminModal(true)
              setAdmin(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock-open' fontSize={20} />
            Mở khóa
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setOpenDeleteAdminModal(true)
            setAdmin(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:trash' fontSize={20} />
          Xóa
        </MenuItem>
      </Menu>
    </>
  )
}
