import { createFileRoute, Navigate } from '@tanstack/react-router'
import AdminDashboard from '@/features/dashboard/admin'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/_authenticated/admin')({
  component: () => {
    const { user } = useAuth()
    const isAdmin = useIsAdmin()
    const isLoading = user?.isLoading || user?.isFetching

    if (isLoading) {
      return (
        <div className="flex items-center justify-center" style={{ padding: 32, minHeight: '50vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando usuário...</p>
          </div>
        </div>
      )
    }
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <AdminDashboard />
  },
})
