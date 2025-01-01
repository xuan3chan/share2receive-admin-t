import { Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'

export default function ReadFileXlsx({ title, pathname }: { title: string; pathname: string }) {
  const router = useRouter()
  const searchParams = router.query
  const file = searchParams.file?.toString() || ''

  const handleBack = () => {
    router.push({
      pathname: pathname,
      query: {
        ...searchParams,
        file: ''
      }
    })
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 2, ml: 2 }}>
        <Button variant='contained' color='primary' onClick={handleBack}>
          Quay lại
        </Button>
        <Typography variant='h4' sx={{ mb: 2, ml: 2 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${file}`}
          width='100%'
          height='600px'
          frameBorder='0'
        ></iframe>
      </Box>
    </>
  )
}
