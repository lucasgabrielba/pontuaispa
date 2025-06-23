import {
  IconHelp,
  IconLayoutDashboard,
} from '@tabler/icons-react'
import { CreditCard, FileText, SquareAsterisk } from 'lucide-react'
import { type SidebarData } from '../types'

export const clienteSidebarData: SidebarData = {
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
          title: 'Cartões',
          url: '/cartoes',
          icon: CreditCard,
        },
        {
          title: 'Faturas',
          url: '/faturas',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Outros',
      items: [
        {
          title: 'Central de Ajuda',
          url: '/central-de-ajuda',
          icon: IconHelp,
        },
      ],
    },
  ],
}
