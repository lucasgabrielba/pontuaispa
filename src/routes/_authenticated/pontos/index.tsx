/**
 * routes/_authenticated/pontos/index.lazy.tsx - Rota para gerenciamento de pontos
 */
import PontosPage from '@/features/pontos'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated/pontos/')({
  component: PontosPage,
})
