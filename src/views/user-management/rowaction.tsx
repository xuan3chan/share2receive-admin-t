import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { useUsersStore } from 'src/zustand/users'
import { UserObject } from 'src/types/user/userTypes'

export const RowOptions = ({ data }: { data: UserObject }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { setOpenBlockUser, setOpenDeleteUser, setOpenUnblockUser, setUser } = useUsersStore()
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
        {!data.isBlock ? (
          <MenuItem
            onClick={() => {
              setOpenBlockUser(true)
              setUser(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock' fontSize={20} />
            Khóa
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setOpenUnblockUser(true)
              setUser(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock-open' fontSize={20} />
            Mở khóa
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setOpenDeleteUser(true)
            setUser(data)
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
