import { Outlet } from '@tanstack/react-router'
import {
  IconNotification,
  IconPalette,
  IconTool,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Configurações
          </h1>
          <p className='text-muted-foreground'>
            Configure sua conta, notificações e preferências de exibição.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Conta',
    icon: <IconTool size={18} />,
    href: '/configuracoes/conta',
  },
  {
    title: 'Aparência',
    icon: <IconPalette size={18} />,
    href: '/configuracoes/aparencia',
  },
  {
    title: 'Notificações',
    icon: <IconNotification size={18} />,
    href: '/configuracoes/notificacoes',
  },
]
