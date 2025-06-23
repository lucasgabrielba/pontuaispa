import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'

import { useIsAdmin } from '@/hooks/use-is-admin'
import { UserPlanSwitcher } from './plan-switcher'
import { clienteSidebarData } from './data/cliente-routes'
import { adminSidebarData } from './data/admin-routes'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = useIsAdmin()
  const sidebarData = isAdmin ? adminSidebarData : clienteSidebarData
  
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <UserPlanSwitcher user={sidebarData.user} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
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
