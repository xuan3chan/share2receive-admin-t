import { LoadingButton } from '@mui/lab'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import React from 'react'

interface AlertDeleteProps {
  onSubmit: () => Promise<void>
  onClose: () => void
  open: boolean
  title: string
  content: string
  loading: boolean
  submitText?: string
}

export const AlertDelete: React.FC<AlertDeleteProps> = ({
  onSubmit,
  onClose,
  open,
  title,
  content,
  loading,
  submitText
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose} color='primary'>
          Hủy
        </Button>
        <LoadingButton variant='contained' onClick={onSubmit} loading={loading} color='error' autoFocus>
          {submitText || 'Xóa'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
