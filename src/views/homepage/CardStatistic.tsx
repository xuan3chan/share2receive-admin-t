import { Box, Card, CardContent, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import Avatar from 'src/@core/components/mui/avatar'
import { keyframes } from '@mui/system'
import { motion } from 'framer-motion'

// Add pulse animation keyframes
const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`

// Add ActiveDot component
const ActiveDot = () => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'success.main',
      position: 'absolute',
      top: 15,
      right: 0,
      bottom: 0,
      left: 15,
      animation: `${pulseAnimation} 2s infinite`,
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%'
      }
    }}
  />
)

export default function CardStatistic({
  title,
  number,
  subtitle,
  icon,
  color,
  activeStatus,
  bgColor
}: {
  title: string
  number: string
  subtitle?: string
  icon: string
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | undefined
  activeStatus?: boolean
  bgColor?: string
}) {
  return (
    <motion.div whileHover={{ translateY: -5, boxShadow: 'rgba(0,0,0,0.2)' }}>
      <Card
        sx={{
          borderRadius: '12px',
          boxShadow: 0,
          border: 1,
          borderColor: 'divider',
          bgcolor: bgColor || 'background.paper',
          '&:hover': {
            boxShadow: 4
          }
        }}
      >
        <CardContent sx={{ padding: '14px', gap: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography sx={{ mb: 1, color: 'text.secondary' }}>{title}</Typography>
            <Box sx={{ mb: 1, columnGap: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h2' fontWeight={600}>
                {number}
              </Typography>
            </Box>
            {subtitle && (
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar skin='light' variant='rounded' color={color} sx={{ width: 38, height: 38 }}>
            <Box sx={{ position: 'relative' }}>
              <IconifyIcon icon={icon} fontSize={24} />
              {activeStatus && <ActiveDot />}
            </Box>
          </Avatar>
        </CardContent>
      </Card>
    </motion.div>
  )
}
