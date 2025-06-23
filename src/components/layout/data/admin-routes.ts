import {
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
} from '@tabler/icons-react'
import {  SquareAsterisk, Users } from 'lucide-react'
import { type SidebarData } from '../types'

export const adminSidebarData: SidebarData = {
  user: {
    name: 'Lucas',
    email: 'lucasgabrielba@gmail.com',
    avatar: '/avatars/shadcn.jpg',
    plan: 'Administrador',
  },
  teams: [
    {
      name: 'Pontu AI',
      logo: SquareAsterisk,
      plan: 'Administrador',
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
          title: 'Usuários',
          url: '/admin/usuarios',
          icon: Users,
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
              title: 'Conta',
              url: '/configuracoes/conta',
              icon: IconTool,
            },
            {
              title: 'Aparência',
              url: '/configuracoes/aparencia',
              icon: IconPalette,
            },
            {
              title: 'Notificações',
              url: '/configuracoes/notificacoes',
              icon: IconNotification,
            },
          ],
        },
        {
          title: 'Central de Ajuda',
          url: '/central-de-ajuda',
          icon: IconHelp,
        },
      ],
    },
  ],
}
