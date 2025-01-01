import { Grid, Typography } from '@mui/material'
import { ReactDatePickerProps } from 'react-datepicker'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import StatisticsOrder from 'src/views/homepage/StatisticsOrder'
import StatisticsRegister from 'src/views/homepage/StatisticsRegister'
import StatisticsReveneu from 'src/views/homepage/StatisticsReveneu'
import RechartsWrapper from 'src/@core/styles/libs/recharts'
import useSWR from 'swr'
import statisticsService from 'src/services/statistics/statistics.service'
import CountUp from 'react-countup'

const HomePage = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  const { data: totalWeight } = useSWR('/api/statistics/get-static-eco-all', statisticsService.getEcoWeight)

  return (
    <RechartsWrapper>
      <DatePickerWrapper>
        <PageHeader title={<Typography variant='h1'>Tổng quan</Typography>} />
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12}>
            <StatisticsReveneu popperPlacement={popperPlacement} />
          </Grid>
          <Grid item xs={12}>
            <StatisticsOrder popperPlacement={popperPlacement} />
          </Grid>
          <Grid item xs={8.5}>
            <StatisticsRegister popperPlacement={popperPlacement} />
          </Grid>
          <Grid item xs={3.5}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundImage:
                  'url(/images/carbon-neutral-concept-net-zero-greenhouse-gas-emi-2024-05-14-00-07-57-utc.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: '-110px 0px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  borderRadius: '8px',
                  padding: '1rem',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              >
                <div>
                  <Typography variant='h1' sx={{ color: 'white', fontWeight: 700 }}>
                    Tổng khối lượng rác thải đã giảm thiểu
                  </Typography>
                  <div
                    style={{
                      backgroundColor: 'white',
                      width: 'fit-content',
                      padding: '10px',
                      borderRadius: '9px'
                    }}
                  >
                    <Typography sx={{ color: '#2b8a3b', fontSize: '40px', fontWeight: 700 }}>
                      <CountUp end={totalWeight?.totalWeight ?? 0} duration={2} decimal='.' /> <span>Kilogram</span>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </RechartsWrapper>
  )
}

HomePage.acl = {
  action: 'read',
  subject: 'homepage'
}
export default HomePage
