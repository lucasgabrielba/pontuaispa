import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsNotifications from '@/features/configuracoes/notificacoes'

export const Route = createLazyFileRoute('/_authenticated/configuracoes/notificacoes')({
  component: SettingsNotifications,
})
