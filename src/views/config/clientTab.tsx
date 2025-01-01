import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import { ConfigType } from 'src/types/config/configType'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import configService from 'src/services/config/config.service'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { KeyedMutator } from 'swr'

export default function ClientTab({
  configData,
  mutate
}: {
  configData: ConfigType | undefined
  mutate: KeyedMutator<ConfigType>
}) {
  const [video1, setVideo1] = useState<string>(configData?.videoUrl_1 || '')
  const [video2, setVideo2] = useState<string>(configData?.videoUrl_2 || '')

  useEffect(() => {
    setVideo1(configData?.videoUrl_1 || '')
    setVideo2(configData?.videoUrl_2 || '')
  }, [configData])

  const schema = object().shape({
    videoUrl_1: string().required('Trường này không được để trống'),
    videoUrl_2: string().required('Trường này không được để trống')
  })

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      videoUrl_1: configData?.videoUrl_1,
      videoUrl_2: configData?.videoUrl_2
    },
    mode: 'onChange'
  })

  if (!configData) {
    return <div>Loading...</div>
  }

  const onSubmit = async (data: any) => {
    if (!configData) {
      return
    }

    // Extract video IDs from URLs
    const videoId1 = extractYoutubeId(data.videoUrl_1) || data.videoUrl_1
    const videoId2 = extractYoutubeId(data.videoUrl_2) || data.videoUrl_2

    // Create an object with only changed values and extracted IDs
    const changedValues = Object.keys(data).reduce((acc: any, key) => {
      const value = key === 'videoUrl_1' ? videoId1 : key === 'videoUrl_2' ? videoId2 : data[key]

      if (value !== configData[key as keyof ConfigType]) {
        acc[key] = value
      }

      return acc
    }, {})

    await configService.updateConfig(
      configData._id,
      changedValues,
      () => {
        toast.success('Cập nhật thành công')
        mutate()
      },
      () => {
        toast.error('Cập nhật thất bại')
      }
    )
  }

  const extractYoutubeId = (url: string): string | undefined => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, // Matches standard and shortened URLs
      /youtube\.com\/embed\/([^&\n?#]+)/ // Matches embed URLs
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }

    return undefined
  }

  const handlePreviewVideo1 = (videoUrl: string | undefined) => {
    if (videoUrl) {
      const videoId = extractYoutubeId(videoUrl)
      if (videoId) setVideo1(videoId)
    }
  }

  const handlePreviewVideo2 = (videoUrl: string | undefined) => {
    if (videoUrl) {
      const videoId = extractYoutubeId(videoUrl)
      if (videoId) setVideo2(videoId)
    }
  }

  const handleReset = () => {
    setVideo1(configData?.videoUrl_1 || '')
    setVideo2(configData?.videoUrl_2 || '')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={10}>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <Typography variant='h6'>Cài đặt video ở phần Hero</Typography>
              </Grid>
              <Grid item xs={9}>
                <Box
                  sx={{
                    width: '500px',
                    height: 'auto',
                    display: 'flex'
                  }}
                >
                  <Controller
                    name='videoUrl_1'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        placeholder='Dán phần id của video vào đây'
                        error={Boolean(errors.videoUrl_1)}
                        {...(errors.videoUrl_1 && { helperText: errors.videoUrl_1.message })}
                      />
                    )}
                  />
                  <Button
                    variant='tonal'
                    sx={{ ml: 2, width: '200px' }}
                    onClick={() => handlePreviewVideo1(getValues('videoUrl_1'))}
                  >
                    Xem trước
                  </Button>
                </Box>
                <Box
                  sx={{
                    width: '500px',
                    height: '285px',
                    mt: 2
                  }}
                >
                  <LiteYouTubeEmbed id={video1} title='YouTube video player' muted />
                </Box>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <Typography variant='h6'>Cài đặt video ở phần các thương hiệu</Typography>
              </Grid>
              <Grid item xs={9}>
                <Box
                  sx={{
                    width: '500px',
                    height: 'auto',
                    display: 'flex'
                  }}
                >
                  <Controller
                    name='videoUrl_2'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        error={Boolean(errors.videoUrl_2)}
                        {...(errors.videoUrl_2 && { helperText: errors.videoUrl_2.message })}
                        placeholder='Dán phần id của video vào đây'
                      />
                    )}
                  />
                  <Button
                    variant='tonal'
                    sx={{ ml: 2, width: '200px' }}
                    onClick={() => handlePreviewVideo2(getValues('videoUrl_2'))}
                  >
                    Xem trước
                  </Button>
                </Box>
                <Box
                  sx={{
                    width: '500px',
                    height: '285px',
                    mt: 2
                  }}
                >
                  <LiteYouTubeEmbed id={video2} title='YouTube video player' muted />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant='outlined' onClick={handleReset}>
            Đặt lại
          </Button>
          <Button disabled={!isValid} type='submit' variant='contained'>
            Lưu
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
