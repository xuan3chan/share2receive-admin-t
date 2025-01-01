import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { ConfigType } from 'src/types/config/configType'
import { KeyedMutator } from 'swr'
import Image from 'next/image'
import configService from 'src/services/config/config.service'
import toast from 'react-hot-toast'

export default function SectionTab({
  configData,
  mutate
}: {
  configData: ConfigType | undefined
  mutate: KeyedMutator<ConfigType>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [file1, setFile1] = useState<File | null>(null)
  const [previewImg, setPreviewImg] = useState<string | ArrayBuffer | null>(null)
  const [previewImg11, setPreviewImg11] = useState<string | ArrayBuffer | null>(null)

  const handleChangePreviewImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (!file) return
    setFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImg(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleChangePreviewImg11 = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (!file) return
    setFile1(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImg11(reader.result)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    setPreviewImg(configData?.sectionUrl_1 || null)
    setPreviewImg11(configData?.sectionUrl_2 || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async () => {
    if (!configData) {
      return
    }
    const formData = new FormData()

    formData.append('type', 'sectionUrl_1')

    if (file) {
      formData.append('file', file)
    }

    await configService.uploadSections(
      configData?._id,
      formData,
      () => {
        mutate()
        toast.success('Cập nhật thành công')
        setFile(null)
      },
      () => {
        toast.error('Cập nhật thất bại')
      }
    )
  }

  const onSubmit1 = async () => {
    if (!configData) {
      return
    }
    const formData = new FormData()

    formData.append('type', 'sectionUrl_2')

    if (file1) {
      formData.append('file', file1)
    }

    await configService.uploadSections(
      configData?._id,
      formData,
      () => {
        mutate()
        toast.success('Cập nhật thành công')
        setFile1(null)
      },
      () => {
        toast.error('Cập nhật thất bại')
      }
    )
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Grid container spacing={10}>
          <Grid item container xs={12}>
            <Grid item xs={3}>
              <Typography variant='h6'>Hình nền cho phần thời trang nam</Typography>
            </Grid>
            <Grid item xs={9}>
              {previewImg ? (
                <div
                  style={{
                    width: '700px',
                    height: 'auto'
                  }}
                >
                  <Image
                    src={previewImg as string}
                    width={900}
                    height={100}
                    quality={100}
                    alt='preview'
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ) : (
                configData?.sectionUrl_1 && (
                  <div
                    style={{
                      width: '600px',
                      height: 'auto'
                    }}
                  >
                    <Image
                      src={configData?.sectionUrl_1}
                      width={900}
                      height={900}
                      quality={100}
                      alt='preview'
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )
              )}
              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='raised-button-file'
                type='file'
                onChange={handleChangePreviewImg}
              />
              <label htmlFor='raised-button-file'>
                <Button variant='contained' component='span'>
                  Tải ảnh lên
                </Button>
              </label>
              {file && (
                <>
                  <Button
                    variant='contained'
                    sx={{
                      marginLeft: 2
                    }}
                    onClick={onSubmit}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    variant='outlined'
                    sx={{
                      marginLeft: 2
                    }}
                    onClick={() => {
                      setPreviewImg(configData?.sectionUrl_1 || null) // Lấy lại hình ảnh từ configData
                      setFile(null) // Xóa file đã chọn
                    }}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Grid item xs={3}>
              <Typography variant='h6'>Hình nền cho phần thời trang unisex</Typography>
            </Grid>
            <Grid item xs={9}>
              {previewImg11 ? (
                <div
                  style={{
                    width: '700px',
                    height: 'auto'
                  }}
                >
                  <Image
                    src={previewImg11 as string}
                    width={900}
                    height={900}
                    quality={100}
                    alt='preview'
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ) : (
                configData?.sectionUrl_2 && (
                  <div
                    style={{
                      width: '500px',
                      height: 'auto'
                    }}
                  >
                    <Image
                      src={configData?.sectionUrl_2}
                      width={900}
                      height={900}
                      quality={100}
                      alt='preview'
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )
              )}
              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='raised-button-file11'
                type='file'
                onChange={handleChangePreviewImg11}
              />
              <label htmlFor='raised-button-file11'>
                <Button variant='contained' component='span'>
                  Tải ảnh lên
                </Button>
              </label>
              {file1 && (
                <>
                  <Button
                    variant='contained'
                    onClick={onSubmit1}
                    sx={{
                      marginLeft: 2
                    }}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    variant='outlined'
                    sx={{
                      marginLeft: 2
                    }}
                    onClick={() => {
                      setPreviewImg11(configData?.sectionUrl_2 || null) // Lấy lại hình ảnh từ configData
                      setFile1(null) // Xóa file đã chọn
                    }}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
