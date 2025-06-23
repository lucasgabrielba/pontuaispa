import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import Chats from '@/features/chats'
import { useIsClient } from '@/hooks/use-is-client'

export const Route = createLazyFileRoute('/_authenticated/chats/')({
  component: () => {
    const isClient = useIsClient();
    if (!isClient) {
      return <Navigate to="/admin" />;
    }
    return <Chats />;
  },
})
