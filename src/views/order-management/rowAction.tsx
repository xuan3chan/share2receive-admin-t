import { Order } from 'src/types/order/orderType'
import Icon from 'src/@core/components/icon'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useOrderStore } from 'src/zustand/order'

export default function RowActions({ data }: { data: Order }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const { setOpenViewOrder, setOrder } = useOrderStore()
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
            setOpenViewOrder(true)
            setOrder(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          Xem
        </MenuItem>
      </Menu>
    </>
  )
}
