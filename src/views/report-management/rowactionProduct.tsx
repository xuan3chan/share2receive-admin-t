import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { ReportProduct } from 'src/types/report/reportTypes'
import { useReportStore } from 'src/zustand/report'

export const RowOptions = ({ data }: { data: ReportProduct }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { setOpenUnblockUserProduct, setOpenBlockProduct, setOpenWarningUser, setOpenBlockUserProduct, setReport2 } =
    useReportStore()

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
            setOpenWarningUser(true)
            setReport2(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='ph:warning-duotone' fontSize={20} />
          Cảnh cáo người dùng
        </MenuItem>

        {data.status === 'Processed' ? null : (
          <MenuItem
            onClick={() => {
              setOpenBlockProduct(true)
              setReport2(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock' fontSize={20} />
            Khóa sản phẩm
          </MenuItem>
        )}

        {data.target.userId.isBlock ? (
          <MenuItem
            onClick={() => {
              setOpenUnblockUserProduct(true)
              setReport2(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock-open-2' fontSize={20} />
            Mở khóa người dùng
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setOpenBlockUserProduct(true)
              setReport2(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='solar:user-block-linear' fontSize={20} />
            Khóa người dùng
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
