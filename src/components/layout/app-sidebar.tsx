import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { sidebarData } from './data/sidebar-data'
import { sidebarRoutesAdmin } from './data/sidebar-routes-admin'
import { sidebarRoutesCliente } from './data/sidebar-routes-cliente'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { UserPlanSwitcher } from './plan-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = useIsAdmin()
  // Mantém user/teams do sidebarData, mas troca navGroups conforme perfil
  const navGroups = isAdmin ? [
    {
      title: 'Admin',
      items: sidebarRoutesAdmin,
    },
  ] : [
    ...sidebarData.navGroups,
  ]
  const sidebarDataDynamic = {
    ...sidebarData,
    navGroups,
  }
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <UserPlanSwitcher user={sidebarDataDynamic.user} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarDataDynamic.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
