/**
 * routes/_authenticated/faturas/index.lazy.tsx - Rota para listagem e upload de faturas
 */
import FaturasUpload from '@/features/faturas/upload'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/faturas/')({
  component: FaturasUpload,
})