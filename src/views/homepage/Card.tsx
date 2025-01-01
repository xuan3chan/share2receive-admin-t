import { Box, Card, CardContent, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import Avatar from 'src/@core/components/mui/avatar'
import { motion } from 'framer-motion'

export default function CardStatisticRevenue({
  title,
  number,
  subtitle,
  icon,
  iconPoint,
  color,
  viewBy,
  bgColor
}: {
  title: string
  number: string
  subtitle: string
  icon: string
  iconPoint: string
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | undefined
  viewBy?: string
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
            <Typography variant='h6' sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>
          <Avatar skin='light' variant='rounded' color={color} sx={{ width: 38, height: 38 }}>
            {viewBy === 'revenue' && <IconifyIcon icon={icon} fontSize={24} />}
            {viewBy === 'point' && <IconifyIcon icon={iconPoint} fontSize={24} />}
          </Avatar>
        </CardContent>
      </Card>
    </motion.div>
  )
}
