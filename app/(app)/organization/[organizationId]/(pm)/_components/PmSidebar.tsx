'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@src/components/animate-ui/components/radix/sidebar'
import HoverLink from '@src/components/HoverLink'
import { Button } from '@src/components/ui/button'
import { OrganizationSidebarMenu } from '@src/modules/tenant/organization/organizationSidebarMenu'
import { Search, SquarePen } from 'lucide-react'
import PmNavLink from './PmNavLink'
import PmProfileMenu from './PmProfileMenu'
import PmWorkspaceMenu from './PmWorkspaceMenu'

interface PmSidebarProps {
  organizationId: string
  clientsSlot?: React.ReactNode
}

const PmSidebar = ({ organizationId, clientsSlot }: PmSidebarProps) => {
  return (
    <Sidebar
      className="border-transparent"
      innerClassName="p-2"
      peekTopOffset="2.5rem"
      peekOverlay
    >
      <SidebarHeader className="flex-row items-center justify-between gap-1 overflow-hidden">
        <PmProfileMenu organizationId={organizationId} />
        <div className="flex items-center gap-1 shrink-0 group-data-[collapsible=icon]:hidden">
          <Button
            asChild
            variant="ghost"
            size="icon"
            title="Search"
            className="size-7"
          >
            <HoverLink href={`/organization/${organizationId}/search`}>
              <Search className="size-3" />
            </HoverLink>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            title="New project"
            className="size-7"
          >
            <HoverLink href={`/organization/${organizationId}/projects/create`}>
              <SquarePen className="size-3" />
            </HoverLink>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4">
        <SidebarMenu className="px-2 py-1">
          {OrganizationSidebarMenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <PmNavLink
                href={(item.href ?? '#').replace(
                  '[organizationId]',
                  organizationId,
                )}
                label={item.title}
                icon={<item.icon className="w-3.5 h-3.5 shrink-0" />}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <PmWorkspaceMenu organizationId={organizationId} />
        {clientsSlot}
      </SidebarContent>
    </Sidebar>
  )
}

export default PmSidebar
