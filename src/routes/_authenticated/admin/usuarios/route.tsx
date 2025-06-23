import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { useAuth } from '@/hooks/use-auth'
import UsersFeature from '@/features/admin/users'

export const Route = createFileRoute('/_authenticated/admin/usuarios')({
  component: () => {
    const { user } = useAuth()
    const isAdmin = useIsAdmin()
    // React Query retorna isLoading/isFetching
    const isLoading = user?.isLoading || user?.isFetching
    if (isLoading) {
      // Pode trocar por um spinner se preferir
      return null
    }
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <UsersFeature />
  },
})
