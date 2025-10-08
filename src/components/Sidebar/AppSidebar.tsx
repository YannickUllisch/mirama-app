'use client'
import { useIsMobile } from '@hooks/utils/use-mobile'
import { AppMenu } from '@src/lib/sidebarMenu'
import { cn, isTeamAdminOrOwner } from '@src/lib/utils'
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
import type { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import HoverLink from '../HoverLink'
import SidebarMainNav from './MainNav'
import RecentsNav from './RecentsNav'

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'props'> {
  session: Session | null
}

const AppSidebar: React.FC<AppSidebarProps> = ({ session, ...props }) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const isAdminOrOwner = useMemo(() => {
    return isTeamAdminOrOwner(session)
  }, [session])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn('border-sidebar-border ', isMobile ? '' : 'mt-[55px]')}
      >
        {isMobile && (
          <HoverLink href="/" className="flex items-center gap-2 p-2">
            <span className="text-lg font-semibold text-sidebar-foreground">
              .mirama
            </span>
          </HoverLink>
        )}
        {isAdminOrOwner && (
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
        <SidebarMainNav pathname={pathname} items={AppMenu} session={session} />
        <RecentsNav pathname={pathname} />
      </SidebarContent>
      <SidebarFooter className="p-2">
        {/* <div className="flex items-center justify-center p-3 rounded-xl h-[150px] w-full bg-card dark:bg-black/40 overflow-clip">
          ...
        </div> */}
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
