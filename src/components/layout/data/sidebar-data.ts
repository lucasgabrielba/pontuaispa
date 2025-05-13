import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { SquareAsterisk } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Lucas',
    email: 'lucasgabrielba@gmail.com',
    avatar: '/avatars/shadcn.jpg',
    plan: 'Plano Gratuito',
  },
  teams: [
    {
      name: 'Pontu AI',
      logo: SquareAsterisk,
      plan: 'Plano Gratuito',
    }
  ],
  navGroups: [
    {
      title: 'Geral',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Gastos',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: IconPackages,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Outros',
      items: [
        {
          title: 'Configurações',
          icon: IconSettings,
          items: [
            {
              title: 'Perfil',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Conta',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Aparência',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notificações',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            // {
            //   title: 'Display',
            //   url: '/settings/display',
            //   icon: IconBrowserCheck,
            // },
          ],
        },
        {
          title: 'Central de Ajuda',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
