import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'

export const Route = createFileRoute('/_authenticated/admin/analises')({
  component: () => {
    const isAdmin = useIsAdmin()
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <div>Análises (Admin)</div>
  },
})
