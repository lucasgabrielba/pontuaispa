import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAccount from '@/features/configuracoes/conta'

export const Route = createLazyFileRoute('/_authenticated/configuracoes/conta')(
  {
    component: SettingsAccount,
  },
)
