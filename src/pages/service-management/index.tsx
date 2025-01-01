import { Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from 'src/@core/components/page-header'
import packetService from 'src/services/packet/packet.service'
import { AlertDelete } from 'src/views/components/alert'
import ModalAdd from 'src/views/packet-management/modalAdd'
import ModalAddImage from 'src/views/packet-management/modalAddImage'
import ModalUpdate from 'src/views/packet-management/modalUpdate'
import PacketCard from 'src/views/packet-management/packetCard'
import { usePacketStore } from 'src/zustand/packet'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'

export default function ServiceManagement() {
  const { data } = useSWR('/api/packet', packetService.getPackets, {
    revalidateOnMount: true
  })

  const [openAddModal, setOpenAddModal] = useState(false)
  const {
    openUpdateModal,
    setOpenUpdateModal,
    packet,
    setPacket,
    openDeleteModal,
    setOpenDeleteModal,
    openAddImageModal,
    setOpenAddImageModal
  } = usePacketStore()
  const [loading, setLoading] = useState(false)

  const handleOpenAddModal = () => {
    setOpenAddModal(true)
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
  }

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false)
    setPacket(null)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const handleDeletePacket = async () => {
    if (!packet?._id) return

    setLoading(true)
    await packetService.deletePacket(
      packet._id,
      () => {
        toast.success('Xóa gói nạp thành công')
        setOpenDeleteModal(false)
        setLoading(false)
      },
      error => {
        toast.error(error)
        setOpenDeleteModal(false)
        setLoading(false)
      }
    )
  }

  return (
    <>
      <ModalAddImage open={openAddImageModal} onClose={() => setOpenAddImageModal(false)} packet={packet} />
      <AlertDelete
        title='Xóa gói nạp'
        content='Bạn có chắc chắn muốn xóa gói nạp này không?'
        loading={loading}
        onClose={handleCloseDeleteModal}
        open={openDeleteModal}
        onSubmit={handleDeletePacket}
        submitText='Xóa'
      />
      <ModalAdd open={openAddModal} onClose={handleCloseAddModal} />
      <ModalUpdate open={openUpdateModal} onClose={handleCloseUpdateModal} packet={packet} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader
          title={<Typography variant='h2'>Quản lý gói nạp</Typography>}
          subtitle='Các gói nạp đang có trong hệ thống'
        />
        <Grid justifyContent='flex-end' alignItems='end'>
          <Button variant='contained' color='primary' onClick={handleOpenAddModal}>
            Thêm gói nạp
          </Button>
        </Grid>
      </div>

      <Grid container spacing={2} mt={4}>
        <AnimatePresence mode='sync'>
          {data?.map((packet, index) => (
            <Grid item xs={12} md={4} key={packet._id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                layout
              >
                <PacketCard packet={packet} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </>
  )
}
