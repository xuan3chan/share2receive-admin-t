import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Button
} from '@mui/material'
import { Packet } from 'src/types/packet/packetType'
import { formatPrice } from 'src/helpers'
import Image from 'next/image'
import IconifyIcon from 'src/@core/components/icon'
import { MouseEvent, useState } from 'react'
import { usePacketStore } from 'src/zustand/packet'
import packetService from 'src/services/packet/packet.service'
import toast from 'react-hot-toast'

export default function PacketCard({ packet }: { packet: Packet }) {
  const { setOpenUpdateModal, setPacket, setOpenDeleteModal, setOpenAddImageModal } = usePacketStore()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleOpenUpdateModal = (packet: Packet) => {
    setOpenUpdateModal(true)
    setPacket(packet)
    handleRowOptionsClose()
  }

  const handleOpenDeleteModal = (packet: Packet) => {
    setOpenDeleteModal(true)
    setPacket(packet)
    handleRowOptionsClose()
  }

  const handleOpenAddImageModal = (packet: Packet) => {
    setOpenAddImageModal(true)
    setPacket(packet)
    handleRowOptionsClose()
  }

  const handleChangeStatus = async () => {
    setTimeout(async () => {
      await packetService.updatePacket(
        packet._id,
        { status: packet.status === 'active' ? 'inactive' : 'active' },
        () => {
          toast.success('Cập nhật trạng thái gói nạp thành công', { position: 'top-center' })
        },
        error => {
          toast.error(error, { position: 'top-center' })
        }
      )
    }, 500)
  }

  return (
    <Card>
      <CardHeader
        title={packet.name}
        action={
          <>
            <IconButton onClick={handleRowOptionsClick}>
              <IconifyIcon icon='mdi:dots-vertical' />
            </IconButton>
            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={handleRowOptionsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem onClick={() => handleOpenUpdateModal(packet)}>
                <IconifyIcon icon='tabler:edit' style={{ marginRight: '0.5rem' }} />
                Chỉnh sửa
              </MenuItem>
              <MenuItem onClick={() => handleOpenDeleteModal(packet)}>
                <IconifyIcon icon='tabler:trash' style={{ marginRight: '0.5rem' }} />
                Xóa
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent>
        <Stack gap={1}>
          <Typography variant='h6'>
            <span>Mã gói: </span>
            {packet.packetIdUUID}
          </Typography>
          <Typography variant='h6'>
            <span>Tên gói: </span>
            {packet.name}
          </Typography>
          <Typography variant='h6' color='Highlight'>
            <span style={{ color: 'GrayText' }}>Giá: </span>
            {formatPrice(packet.price)}đ
          </Typography>
          <Typography variant='h6' color='Highlight'>
            <span style={{ color: 'GrayText' }}>Điểm cộng: </span>
            {packet.promotionPoint}
          </Typography>
          <Typography
            variant='h6'
            color={packet.status === 'active' ? 'primary' : 'error'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span
              style={{
                color: 'GrayText'
              }}
            >
              Trạng thái:
            </span>
            <FormGroup row>
              <FormControlLabel
                control={<Switch defaultChecked={packet.status === 'active'} onChange={handleChangeStatus} />}
                label={packet.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
              />
            </FormGroup>
          </Typography>
          <Typography variant='h6' sx={{ whiteSpace: 'pre-line' }}>
            <span>Mô tả: </span>
            {packet.description}
          </Typography>
          <Divider />
          {packet.image && (
            <>
              <Typography variant='h6'>
                <span>Ảnh: </span>
              </Typography>
              <div style={{ width: '30%', height: 'auto' }}>
                <Image
                  src={packet.image || ''}
                  alt={`Ảnh gói ${packet.name}`}
                  width={100}
                  height={100}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <Button variant='contained' color='primary' onClick={() => handleOpenAddImageModal(packet)}>
                Thay đổi ảnh
              </Button>
            </>
          )}
          {!packet.image && (
            <Button variant='contained' color='primary' onClick={() => handleOpenAddImageModal(packet)}>
              Thêm ảnh
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
