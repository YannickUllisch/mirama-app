'use client'
import { useIsMobile } from '@hooks/utils/use-mobile'
import { AppMenu } from '@src/lib/sidebarMenu'
import { cn, isOrgAdminOrOwner } from '@src/lib/utils'
import type { AppMenuItem } from '@src/types/types'
import { Button } from '@ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from '@ui/sidebar'
import { CircleHelp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'
import HoverLink from '../HoverLink'
import MiramaIcon from '../MiramaIcon'
import SidebarMainNav from './MainNav'
import RecentsNav from './RecentsNav'

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'props'> {
  session: Session | null
  menuItems: AppMenuItem[]
  roleType: 'org' | 'tenant'
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  session,
  menuItems,
  roleType,
  ...props
}) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const currentRole =
    roleType === 'org' ? session?.user?.orgRole : session?.user?.tenantRole
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn('border-sidebar-border ', isMobile ? '' : 'mt-[55px]')}
      >
        {isMobile && (
          <HoverLink href="/" className="flex items-center gap-2 p-2">
            <MiramaIcon />
          </HoverLink>
        )}
        {isOrgAdminOrOwner(session) && (
          <HoverLink href={'/app/projects/create'}>
            <Button className="w-full justify-start gap-2 p-3">
              <span className="text-sidebar-primary">+</span>
              <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                New
              </span>
            </Button>
          </HoverLink>
        )}
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMainNav
          pathname={pathname}
          items={AppMenu}
          userRole={currentRole}
        />
        {roleType === 'org' && <RecentsNav pathname={pathname} />}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <HoverLink href={'/contact'}>
            <SidebarMenuButton>
              <CircleHelp className="w-4 h-4" />
              Contact
            </SidebarMenuButton>
          </HoverLink>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
