import { IconLayoutDashboard, IconSettings } from '@tabler/icons-react';
import { FileText } from 'lucide-react';

import type { NavItem } from '../types'

export const sidebarRoutesAdmin: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: IconLayoutDashboard,
  },
  {
    title: 'Análises',
    url: '/admin/analises',
    icon: IconLayoutDashboard,
  },
  {
    title: 'Faturas',
    url: '/admin/faturas',
    icon: FileText,
  },
  {
    title: 'Usuários',
    url: '/admin/usuarios',
    icon: IconLayoutDashboard,
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: IconSettings,
  },
];
