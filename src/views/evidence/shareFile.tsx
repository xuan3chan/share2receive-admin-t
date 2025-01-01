import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useEvidenceStore } from 'src/zustand/evidence'

export default function ShareFile() {
  const { url, toggleOpenShare, openShare, setUrl } = useEvidenceStore()
  const [copied, setCopied] = useState(false)

  const onClose = () => {
    toggleOpenShare()
    setUrl('')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  return (
    <Dialog open={openShare} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Chia sẻ tệp</DialogTitle>
      <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={onClose}>
        <IconifyIcon icon='ic:outline-close' />
      </IconButton>
      <DialogContent>
        <Typography variant='h6'>Link chia sẻ</Typography>
        {url ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomTextField disabled value={url} fullWidth />
            <IconButton onClick={handleCopyLink}>
              <IconifyIcon icon='ic:outline-content-copy' />
            </IconButton>
            <p>{copied ? 'Đã copy link' : ''}</p>
          </div>
        ) : (
          <CustomTextField disabled value='Đang tạo link...' fullWidth />
        )}
      </DialogContent>
    </Dialog>
  )
}
