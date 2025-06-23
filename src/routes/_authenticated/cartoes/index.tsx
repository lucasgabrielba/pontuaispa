/**
 * routes/_authenticated/cartoes/index.lazy.tsx - Rota para gerenciamento de cartões
 */
import CartoesPage from '@/features/cartoes'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createFileRoute('/_authenticated/cartoes/')({
  component: () => {
    const isClient = useIsClient();
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <CartoesPage />;
  },
})
