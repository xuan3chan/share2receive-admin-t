import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { ReportOrder } from 'src/types/report/reportTypes'
import { useReportStore } from 'src/zustand/report'

export const RowOptions = ({ data }: { data: ReportOrder }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { setReport, setOpenBlockUser, setOpenUnblockUser, setOpenWarningUser } = useReportStore()

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
            setReport(data)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='ph:warning-duotone' fontSize={20} />
          Cảnh cáo người dùng
        </MenuItem>
        {data.target.sellerId.isBlock ? (
          <MenuItem
            onClick={() => {
              setOpenUnblockUser(true)
              setReport(data)
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon icon='tabler:lock-open-2' fontSize={20} />
            Mở khóa người dùng
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setOpenBlockUser(true)
              setReport(data)
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
