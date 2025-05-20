import { InvoiceDetails } from '@/features/faturas/details'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/faturas/$invoiceId')({
  component: InvoiceDetails
})