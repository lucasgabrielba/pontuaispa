/**
 * routes/_authenticated/faturas/index.lazy.tsx - Rota para listagem e upload de faturas
 */
import FaturasUpload from '@/features/faturas/upload'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createLazyFileRoute('/_authenticated/faturas/')({
  component: () => {
    const isClient = useIsClient();
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <FaturasUpload />;
  },
})