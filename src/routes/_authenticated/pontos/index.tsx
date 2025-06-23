/**
 * routes/_authenticated/pontos/index.lazy.tsx - Rota para gerenciamento de pontos
 */
import PontosPage from '@/features/pontos'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createFileRoute('/_authenticated/pontos/')({
  component: () => {
    const isClient = useIsClient();
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <PontosPage />;
  },
})
