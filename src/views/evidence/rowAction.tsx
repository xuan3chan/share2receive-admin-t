import { MouseEvent, useState } from 'react'
import { Evidence } from 'src/types/evidence/evidenceType'
import Icon from 'src/@core/components/icon'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useEvidenceStore } from 'src/zustand/evidence'

export default function RowActions({ data }: { data: Evidence }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const { toggleOpenUpdate, setEvidenceId } = useEvidenceStore()

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
            setEvidenceId(data._id)
            toggleOpenUpdate()
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={20} />
          Cập nhật
        </MenuItem>
      </Menu>
    </>
  )
}
