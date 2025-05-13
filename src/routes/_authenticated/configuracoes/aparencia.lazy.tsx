import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAppearance from '@/features/configuracoes/aparencia'

export const Route = createLazyFileRoute('/_authenticated/configuracoes/aparencia')(
  { component: SettingsAppearance }
)
