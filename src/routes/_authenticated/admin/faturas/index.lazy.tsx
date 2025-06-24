import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'
import AdminInvoicesFeature from '@/features/admin/faturas'

export const Route = createLazyFileRoute('/_authenticated/admin/faturas/')({
  component: () => {
    const isAdmin = useIsAdmin()
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <AdminInvoicesFeature />
  },
})
