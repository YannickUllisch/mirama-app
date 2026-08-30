// src/components/Sidebar/AppSidebar.tsx
'use client'
import { cn } from '@src/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@ui/sidebar'
import {
  ChevronsUpDown,
  LayoutGrid,
  LogOut,
  PanelLeft,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'children'> {
  children: React.ReactNode
  tenantId: string
  organizationId?: string
}

const AppSidebar = ({
  children,
  tenantId,
  organizationId,
  className,
  ...props
}: AppSidebarProps) => {
  const { toggleSidebar } = useSidebar()
  const { data: session } = useSession()
  const displayName = session?.user?.name ?? session?.user?.email ?? 'Workspace'
  const email = session?.user?.email ?? ''

  return (
    <Sidebar
      collapsible="icon"
      className={cn('border-r border-sidebar-border', className)}
      {...props}
    >
      <SidebarHeader className="p-0 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* padding transitions with the sidebar so logo stays near its position */}
            <button
              type="button"
              className="flex w-full items-center gap-3 h-14 px-4 overflow-hidden hover:bg-sidebar-accent transition-[background-color,padding] duration-200 group-data-[state=collapsed]:px-[10px] focus-visible:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-lava flex items-center justify-center shrink-0">
                <span className="text-[11px] font-black text-white tracking-tight">
                  M
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left overflow-hidden transition-opacity duration-150 group-data-[state=collapsed]:opacity-0">
                <p className="text-[13px] font-semibold text-ink leading-none whitespace-nowrap">
                  MIRAMA
                </p>
                <p className="text-[11px] text-body-text leading-none mt-[3px] whitespace-nowrap">
                  {displayName}
                </p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-body-text/50 shrink-0 transition-opacity duration-150 group-data-[state=collapsed]:opacity-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            sideOffset={4}
            className="min-w-60"
          >
            <DropdownMenuLabel className="font-normal">
              <p className="text-[13px] font-semibold text-ink">MIRAMA</p>
              <p className="text-xs text-body-text mt-0.5 truncate">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/portal" className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Switch workspace
              </Link>
            </DropdownMenuItem>
            {organizationId && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/organization/${organizationId}/settings/general`}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="text-lava focus:text-lava flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent>{children}</SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center p-2 rounded-lg transition-colors text-body-text hover:bg-sidebar-accent hover:text-ink"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4 shrink-0" />
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
