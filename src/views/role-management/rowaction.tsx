import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { Roles } from 'src/types/role/roleType'
import { useRoleStore } from 'src/zustand/roles'

export const RowOptions = ({ data }: { data: Roles }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { setOpenEditRoleModal, setRole, setOpenDeleteRoleModal } = useRoleStore()
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
            setOpenEditRoleModal(true)
            setRole(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={20} />
          Sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteRoleModal(true)
            setRole(data)
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
