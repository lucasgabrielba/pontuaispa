import { createFileRoute, Navigate } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import { useIsClient } from '@/hooks/use-is-client'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/_authenticated/')({
  component: () => {
    const { user } = useAuth();
    const isClient = useIsClient();
    const isLoading = user?.isLoading || user?.isFetching;
    if (isLoading) {
      return null; // ou um spinner
    }
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <Dashboard />;
  },
})
