import { createFileRoute, Navigate } from '@tanstack/react-router'
import AdminDashboard from '@/features/dashboard/admin'
import { useIsAdmin } from '@/hooks/use-is-admin'

export const Route = createFileRoute('/_authenticated/admin')({
  component: () => {
    const isAdmin = useIsAdmin()
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <AdminDashboard />
  },
})
