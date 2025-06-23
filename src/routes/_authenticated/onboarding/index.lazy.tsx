import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import Onboarding from '@/features/onboarding'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createLazyFileRoute('/_authenticated/onboarding/')({
  component: () => {
    const isClient = useIsClient();
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <Onboarding />;
  },
})
