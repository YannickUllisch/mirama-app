'use client'

import apiRequest from '@hooks'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@src/components/ui/sidebar'
import HoverLink from '@src/components/HoverLink'
import { Button } from '@src/components/ui/button'
import {
  mergeSidebarItems,
  serializeSidebarState,
  setItemVisibility,
  type SidebarState,
} from '@src/modules/workspace/sidebar'
import { SIDEBAR_ITEMS } from '@src/modules/workspace/sidebar.manifest'
import type { ClientSummary } from '@src/modules/workspace/viewstate.types'
import { Search, SquarePen } from 'lucide-react'
import { useState } from 'react'
import ShellClientsList from './ShellClientsList'
import ShellFavoritesList from './ShellFavoritesList'
import ShellNavLink from './ShellNavLink'
import ShellProfileMenu from './ShellProfileMenu'
import ShellSidebarContextMenu from './ShellSidebarContextMenu'
import ShellSidebarCustomizeDialog from './ShellSidebarCustomizeDialog'
import ShellWorkspaceMenu from './ShellWorkspaceMenu'

interface ShellSidebarProps {
  organizationId: string
  sidebarState: SidebarState
  clients: ClientSummary[]
}

// Owns the sidebar's personalization state client-side (seeded from the server-fetched
// bootstrap - see ShellSidebarServer) and is the single place that persists it, via the
// existing optimistic saveViewState mutation. Every customizable child (ungrouped items,
// the workspace group) only ever reports "here's the new state" up through `onChange` /
// `commit` - none of them know how or where it's saved. Favourites and Your clients are
// not customizable, so they take plain data props instead.
const ShellSidebar = ({
  organizationId,
  sidebarState: initial,
  clients,
}: ShellSidebarProps) => {
  const [sidebarState, setSidebarState] = useState(initial)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const { mutate: saveSidebar } =
    apiRequest.viewState.saveViewState.useMutation('sidebar', {
      debounceMs: 1000,
    })

  const commit = (next: SidebarState) => {
    setSidebarState(next)
    saveSidebar({ viewType: 'Sidebar', stateJson: serializeSidebarState(next) })
  }

  const resolveHref = (href: string) =>
    href.replace('[organizationId]', organizationId)
  const ungroupedItems = mergeSidebarItems(SIDEBAR_ITEMS, sidebarState.items)
  const workspaceGroup = sidebarState.groups.find(
    (g) => g.group === 'workspace',
  )

  return (
    <Sidebar
      className="border-transparent"
      innerClassName="p-2"
      peekTopOffset="2.5rem"
      peekOverlay
    >
      <SidebarHeader className="flex-row items-center justify-between gap-1 overflow-hidden">
        <ShellProfileMenu organizationId={organizationId} />
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
          {ungroupedItems.map((item) => (
            <ShellSidebarContextMenu
              key={item.route}
              visible={item.visible}
              onVisibilityChange={(v) =>
                commit(setItemVisibility(sidebarState, item.route, v))
              }
              onCustomize={() => setCustomizeOpen(true)}
              href={resolveHref(item.href)}
            >
              <SidebarMenuItem>
                <ShellNavLink
                  href={resolveHref(item.href)}
                  label={item.title}
                  icon={<item.icon className="w-3.5 h-3.5 shrink-0" />}
                />
              </SidebarMenuItem>
            </ShellSidebarContextMenu>
          ))}
        </SidebarMenu>
        <ShellWorkspaceMenu
          organizationId={organizationId}
          groupState={workspaceGroup}
          sidebarState={sidebarState}
          onChange={commit}
          onCustomize={() => setCustomizeOpen(true)}
        />
        <ShellFavoritesList favorites={sidebarState.favorites.items} />
        <ShellClientsList organizationId={organizationId} clients={clients} />
      </SidebarContent>

      <ShellSidebarCustomizeDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        sidebarState={sidebarState}
        onChange={commit}
      />
    </Sidebar>
  )
}

export default ShellSidebar
