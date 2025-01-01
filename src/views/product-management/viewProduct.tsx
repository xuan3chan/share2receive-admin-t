import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography, Stack } from '@mui/material'
import Image from 'next/image'
import { useProductStore } from 'src/zustand/product'
import Icon from 'src/@core/components/icon'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useEffect, useState } from 'react'

export const ViewProductModal = () => {
  const { openViewProduct, setOpenViewProduct, product } = useProductStore()

  const [loaded, setLoaded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(product?.imgUrls?.[0] || null)

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3,
      spacing: 15
    },
    created() {
      setLoaded(true)
    }
  })

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    })

    if (price === 0) {
      return 'Liên hệ'
    }

    return formatter.format(price)
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)

    return d.toLocaleDateString('vi-VN')
  }

  const formatStatusApprove = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt'
      case 'approved':
        return 'Đã duyệt'
      case 'rejected':
        return 'Từ chối'
      case 'blocked':
        return 'Đã chặn'
      case 'unblocked':
        return 'Đã bỏ chặn'
      default:
        return ''
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động'
      case 'inactive':
        return 'Ngừng hoạt động'
      case 'suspend':
        return 'Tạm ngưng'
      default:
        return ''
    }
  }

  const formatType = (type: string) => {
    switch (type) {
      case 'barter':
        return 'Trao đổi'
      case 'sale':
        return 'Bán'
      default:
        return ''
    }
  }

  useEffect(() => {
    if (product) {
      setSelectedImage(product?.imgUrls?.[0] || null)
    }
  }, [product])

  const onClose = () => {
    setOpenViewProduct(false)
    setSelectedImage(product?.imgUrls?.[0] || null)
  }

  return (
    <>
      <Dialog open={openViewProduct} onClose={onClose} fullWidth>
        <DialogTitle>
          <Typography variant='h2'>Chi tiết sản phẩm</Typography>
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={theme => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <Icon icon='material-symbols:close' />
        </IconButton>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item container spacing={3} xs={6}>
              <Grid item xs={12}>
                {/* Main image */}
                <Image
                  src={selectedImage || product?.imgUrls?.[0]}
                  alt={product?.productName}
                  width={400}
                  height={400}
                  loading='lazy'
                  quality={70}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Image slider */}
                <div className='navigation-wrapper'>
                  <div ref={sliderRef} className='keen-slider'>
                    {product?.imgUrls?.map((img, index) => (
                      <div
                        key={index}
                        className='keen-slider__slide'
                        onClick={() => setSelectedImage(img)} // Update the selected image on click
                        style={{
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: selectedImage === img ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)'
                          }}
                        ></div>
                        <Image
                          src={img}
                          alt={product?.productName}
                          width={100}
                          height={100}
                          loading='lazy'
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {loaded && instanceRef.current && (
                    <>
                      <Arrow left onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()} />

                      <Arrow onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()} />
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
            <Grid item container spacing={3} xs={6}>
              {/* Thông tin cột trái */}
              <Grid item xs={12}>
                <Stack spacing={3}>
                  <Typography
                    variant='h4'
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {product?.productName}
                  </Typography>
                  <Typography>
                    <strong>Loại sản phẩm:</strong> {formatType(product?.type)}
                  </Typography>
                  <Typography>
                    <strong>Giá:</strong> {formatPrice(product?.price)}
                  </Typography>
                  <Typography>
                    <strong>Thương hiệu:</strong> {product?.brandName}
                  </Typography>
                  <Typography>
                    <strong>Chất liệu:</strong> {product?.material}
                  </Typography>
                  <Typography>
                    <strong>Người đăng:</strong> {product?.userName}
                  </Typography>
                  <Typography>
                    <strong>Ngày tạo:</strong> {formatDate(product?.createdAt)}
                  </Typography>
                  <Typography>
                    <strong>Trạng thái:</strong> {formatStatus(product?.status)}
                  </Typography>
                  <Typography>
                    <strong>Duyệt:</strong> {formatStatusApprove(product?.approved?.approveStatus)}
                  </Typography>
                  <Typography>
                    <strong>Mô tả:</strong> {product?.approved?.description}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Arrow(props: any) {
  const disabled = props.disabled ? ' arrow--disabled' : ''

  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${props.left ? 'arrow--left' : 'arrow--right'} ${disabled}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      {props.left && <path d='M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z' />}
      {!props.left && <path d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z' />}
    </svg>
  )
}
