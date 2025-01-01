import { Typography } from '@mui/material'
import { Roles } from 'src/types/role/roleType'
import permissions from '../../lib/permission.json'
import { useSettings } from 'src/@core/hooks/useSettings'

interface Permission {
  id: number
  namePermission: string
  color: {
    action_color: string
  }
}

export const TagPermissionNames = ({ data }: { data: Roles }) => {
  const { settings } = useSettings()
  const filteredPermissions: Permission[] = permissions.filter(item => data.permissionID.includes(item.id))

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      {filteredPermissions.map(item => (
        <Typography
          key={item.id}
          sx={{
            color: settings.mode === 'light' ? `${item.color.action_color}` : `${item.color.action_color}`,
            backgroundColor:
              settings.mode === 'light' ? `${item.color.action_color}3D` : `${item.color.action_color}2D`,
            padding: '4px 8px',
            borderRadius: '5px',
            margin: '0 5px',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {item.namePermission.toUpperCase()}
        </Typography>
      ))}
    </div>
  )
}
