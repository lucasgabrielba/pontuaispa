import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
  FileText,
  UserPlus,
  Settings,
  AlertTriangle,
  Ban,
  Eye
} from 'lucide-react'

interface AdminActivity {
  id: string
  type: 'user_created' | 'invoice_processed' | 'system_alert' | 'settings_changed' | 'user_suspended'
  description: string
  user?: {
    name: string
    avatar?: string
  }
  timestamp: string
  severity: 'info' | 'warning' | 'success' | 'error'
}

interface RecentAdminActivitiesProps {
  activities?: AdminActivity[]
  isLoading?: boolean
}

export function RecentAdminActivities({ activities, isLoading = false }: RecentAdminActivitiesProps) {
  const mockActivities: AdminActivity[] = [
    {
      id: '1',
      type: 'user_created',
      description: 'Novo usuário registrado: ana.silva@email.com',
      user: { name: 'Ana Silva' },
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      severity: 'success'
    },
    {
      id: '2',
      type: 'invoice_processed',
      description: 'Fatura processada com sucesso - R$ 1.250,30',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      severity: 'info'
    },
    {
      id: '3',
      type: 'system_alert',
      description: 'Base de dados com alta latência (180ms)',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      severity: 'warning'
    },
    {
      id: '4',
      type: 'settings_changed',
      description: 'Configurações de timeout atualizadas',
      user: { name: 'Admin' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'info'
    },
    {
      id: '5',
      type: 'user_suspended',
      description: 'Usuário suspenso: carlos.santos@email.com',
      user: { name: 'Admin' },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      severity: 'error'
    }
  ]

  const displayActivities = activities || mockActivities

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created': return <UserPlus className="h-4 w-4" />
      case 'invoice_processed': return <FileText className="h-4 w-4" />
      case 'system_alert': return <AlertTriangle className="h-4 w-4" />
      case 'settings_changed': return <Settings className="h-4 w-4" />
      case 'user_suspended': return <Ban className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'success': return 'default'
      case 'warning': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
          <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)} bg-opacity-10`}>
            {getActivityIcon(activity.type)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">
              {activity.description}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getSeverityVariant(activity.severity)} className="text-xs">
                {activity.severity === 'success' ? 'Sucesso' :
                  activity.severity === 'warning' ? 'Atenção' :
                    activity.severity === 'error' ? 'Erro' : 'Info'}
              </Badge>

              <span className="text-xs text-muted-foreground">
                {format(new Date(activity.timestamp), "HH:mm", { locale: pt })}
              </span>

              {activity.user && (
                <div className="flex items-center gap-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {activity.user.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}