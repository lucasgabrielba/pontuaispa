/**
 * routes/_authenticated/cartoes/index.lazy.tsx - Rota para gerenciamento de cartões
 */
import CartoesPage from '@/features/cartoes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/cartoes/')({
  component: CartoesPage,
})
