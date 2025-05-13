import { createLazyFileRoute } from '@tanstack/react-router'
import Settings from '@/features/configuracoes'

export const Route = createLazyFileRoute('/_authenticated/configuracoes')({
  component: Settings,
})
