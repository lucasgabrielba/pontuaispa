import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'

export const Route = createFileRoute('/_authenticated/admin/analytics')({
  component: () => {
    const isAdmin = useIsAdmin()
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <div>Analytics (Admin)</div>
  },
})
