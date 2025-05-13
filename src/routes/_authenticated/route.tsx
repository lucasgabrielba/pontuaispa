import Cookies from 'js-cookie'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { useAuthGuard } from '@/utils/auth-guard'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // Aqui você pode adicionar lógica adicional antes de carregar a rota
  },
  component: RouteComponent,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  const { isLoading } = useAuthGuard()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-t-blue-900 border-r-transparent border-b-blue-900 border-l-transparent animate-spin"></div>
          <div className="mt-4 text-sm text-gray-600 font-medium">Carregando</div>
        </div>
      </div>
    )
  }

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}