import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import ComingSoon from '@/components/coming-soon'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createLazyFileRoute('/_authenticated/central-de-ajuda/')({
  component: () => {
    const isClient = useIsClient();
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <ComingSoon />;
  },
})
