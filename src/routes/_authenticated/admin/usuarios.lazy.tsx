import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'
import UsersFeature from '@/features/admin/users'

export const Route = createLazyFileRoute('/_authenticated/admin/usuarios')({
  component: () => {
    const isAdmin = useIsAdmin()
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <UsersFeature />
  },
})
