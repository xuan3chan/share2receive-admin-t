import { Box, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import PageHeader from 'src/@core/components/page-header'
import useSWR from 'swr'
import configService from 'src/services/config/config.service'
import { SyntheticEvent, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const PointTab = dynamic(() => import('src/views/config/pointTab'), { ssr: false })
const ClientTab = dynamic(() => import('src/views/config/clientTab'), { ssr: false })
const SectionTab = dynamic(() => import('src/views/config/sectionTab'), { ssr: false })

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

export default function HomePageConfigPage() {
  const router = useRouter()

  const { query } = router

  const tab = query.tab as string

  const {
    data: configData,
    mutate,
    isLoading
  } = useSWR('/api/configs', configService.getConfig, {
    revalidateOnMount: true
  })

  const [value, setValue] = useState<string>(tab || 'point-config')

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
    router.push({
      query: { tab: newValue }
    })
  }

  return (
    <>
      <PageHeader
        title={
          <Typography variant='h1' sx={{ mb: 2 }}>
            Cài đặt cấu hình
          </Typography>
        }
        subtitle='Cài đặt và cấu hình các giá trị'
      />
      <Box sx={{ mt: 3 }}>
        <TabContext value={value}>
          <TabList onChange={handleChangeTab} aria-label='customized tabs example'>
            <Tab value='point-config' label='Cài đặt giá trị' />
            <Tab value='video-config' label='Cài đặt video' />
            <Tab value='section-config' label='Cài đặt nền' />
          </TabList>
          <TabPanel sx={{ p: 0 }} value='point-config'>
            <PointTab configData={configData} mutate={mutate} isLoading={isLoading} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='video-config'>
            <ClientTab configData={configData} mutate={mutate} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='section-config'>
            <SectionTab configData={configData} mutate={mutate} />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  )
}
