// src/components/Sidebar/AppSidebar.tsx
'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@ui/sidebar'
import { TextAlignEndIcon, TextAlignStart } from 'lucide-react'
import Link from 'next/link'

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'children'> {
  headerSlot?: React.ReactNode
  children: React.ReactNode
  tenantId: string
  organizationId?: string
}

const AppSidebar = ({
  headerSlot,
  children,
  tenantId,
  organizationId,
  ...props
}: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-0 border-b border-sidebar-border/40">
        {/* Multi-color brand stripe */}
        <div className="flex h-0.5 w-full">
          <div className="flex-1 bg-signature-coral" />
          <div className="flex-1 bg-signature-forest" />
          <div className="flex-1 bg-signature-mint" />
          <div className="flex-1 bg-signature-mustard" />
        </div>
        <div
          className={`flex items-center h-13 px-3 gap-2 ${
            state === 'collapsed' ? 'justify-center' : 'justify-between'
          }`}
        >
          <Link
            href="/"
            prefetch={false}
            className="group-data-[state=collapsed]:hidden shrink-0 pl-1"
          >
            <span className="text-base font-black tracking-tight text-sidebar-foreground">
              MIRAMA<span className="text-sidebar-foreground/35">.</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            {state === 'expanded' ? (
              <TextAlignEndIcon className="w-4 h-4" />
            ) : (
              <TextAlignStart className="w-4 h-4" />
            )}
          </button>
        </div>
        {headerSlot && (
          <div className="group-data-[state=collapsed]:hidden px-2 pb-2">
            {headerSlot}
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        {children}
      </SidebarContent>
      {/* <SidebarFooter className="p-2">
        <SidebarMenu>
          <HoverLink
            href={
              organizationId
                ? `organization/${organizationId}/settings`
                : `tenant/${tenantId}/settings`
            }
          >
            <SidebarMenuButton>
              <CircleHelp className="w-4 h-4" />
              Settings
            </SidebarMenuButton>
          </HoverLink>
        </SidebarMenu>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
