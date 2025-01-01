import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { useBrandStore } from 'src/zustand/brand'
import { Brand } from 'src/types/brand/brandTypes'

export const RowOptions = ({ data }: { data: Brand }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { setOpenUpdateBrand, setBrand, setOpenDeleteBrand, setOpenViewBrand } = useBrandStore()
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
            setOpenViewBrand(true)
            setBrand(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          Xem
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenUpdateBrand(true)
            setBrand(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={20} />
          Sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteBrand(true)
            setBrand(data)
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
