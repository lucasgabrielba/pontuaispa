// src/routes/_authenticated/admin/faturas/$invoiceId.lazy.tsx
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { AdminInvoiceDetails } from '@/features/admin/faturas/details'

export const Route = createLazyFileRoute(
  '/_authenticated/admin/faturas/$invoiceId',
)({
  component: () => {
    const isAdmin = useIsAdmin()
    if (!isAdmin) {
      return <Navigate to="/" />
    }
    return <AdminInvoiceDetails />
  },
})
