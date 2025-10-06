'use client'
import { useIsMobile } from '@hooks/utils/use-mobile'
import { AppMenu } from '@src/lib/sidebarMenu'
import { cn, isTeamAdminOrOwner } from '@src/lib/utils'
import { Button } from '@ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@ui/sidebar'
import type { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import HoverLink from '../HoverLink'
import FavoritesNav from './FavouritesNav'
import SidebarMainNav from './MainNav'
import RecentsNav from './RecentsNav'

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'props'> {
  session: Session | null
}

const AppSidebar: React.FC<AppSidebarProps> = ({ session, ...props }) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const isAdminOrOwner = isTeamAdminOrOwner(session)

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
        <FavoritesNav />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
