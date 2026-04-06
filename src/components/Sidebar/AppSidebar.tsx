// src/components/Sidebar/AppSidebar.tsx
'use client'
import { useIsMobile } from '@hooks/utils/use-mobile'
import { cn } from '@src/lib/utils'
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
import HoverLink from '../HoverLink'

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'children'> {
  headerSlot?: React.ReactNode
  children: React.ReactNode
}

const AppSidebar = ({ headerSlot, children, ...props }: AppSidebarProps) => {
  const isMobile = useIsMobile()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn('border-sidebar-border', isMobile ? '' : 'mt-13.75')}
      >
        {headerSlot}
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        {children}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <HoverLink href="/contact">
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
