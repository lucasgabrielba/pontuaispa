import { IconLayoutDashboard, IconSettings, IconHelp } from '@tabler/icons-react';
import { CreditCard, FileText } from 'lucide-react';

export const sidebarRoutesCliente = [
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
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: IconSettings,
  },
  {
    title: 'Central de Ajuda',
    url: '/central-de-ajuda',
    icon: IconHelp,
  },
];
