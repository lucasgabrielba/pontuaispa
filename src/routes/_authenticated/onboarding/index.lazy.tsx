import { createLazyFileRoute } from '@tanstack/react-router'
import Onboarding from '@/features/onboarding'

export const Route = createLazyFileRoute('/_authenticated/onboarding/')({
  component: Onboarding,
})
