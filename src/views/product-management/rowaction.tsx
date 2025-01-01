import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { useProductStore } from 'src/zustand/product'
import { Product } from 'src/types/product/productType'

export const RowOptions = ({ data }: { data: Product }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { setProduct, setOpenApproveProduct, setOpenViewProduct, setOpenBlockProduct, setOpenUnblockProduct } =
    useProductStore()

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
            setOpenViewProduct(true)
            setProduct(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          Xem
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenApproveProduct(true)
            setProduct(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='akar-icons:check-box-fill' fontSize={20} />
          Duyệt
        </MenuItem>
        {data.isBlock ? (
          <MenuItem
            onClick={() => {
              setOpenUnblockProduct(true)
              setProduct(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock-open-2' fontSize={20} />
            Mở chặn
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setOpenBlockProduct(true)
              setProduct(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock' fontSize={20} />
            Chặn
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
