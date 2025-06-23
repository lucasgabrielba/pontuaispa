import { createFileRoute, Navigate } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createFileRoute('/_authenticated/')({
  component: () => {
    const isClient = useIsClient()
    if (!isClient) {
      return <Navigate to="/admin" />
    }
    return <Dashboard />
  },
})
