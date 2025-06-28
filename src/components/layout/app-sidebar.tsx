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
import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { adminSidebarData } from '@/components/layout/data/admin-routes'
import { clienteSidebarData } from '@/components/layout/data/cliente-routes'
import { UserPlanSwitcher } from '@/components/layout/plan-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = useIsAdmin()
  const location = useLocation()
  const sidebarData = isAdmin ? adminSidebarData : clienteSidebarData
  const [isOnboarding, setIsOnboarding] = useState(false)

  useEffect(() => {
    setIsOnboarding(location.pathname.includes('onboarding'))
  }, [location.pathname])

  if (isOnboarding) {
    return <></>
  }

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