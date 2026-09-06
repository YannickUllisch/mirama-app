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
import PmClientsList from './PmClientsList'
import PmFavoritesList from './PmFavoritesList'
import PmNavLink from './PmNavLink'
import PmProfileMenu from './PmProfileMenu'
import PmSidebarContextMenu from './PmSidebarContextMenu'
import PmSidebarCustomizeDialog from './PmSidebarCustomizeDialog'
import PmWorkspaceMenu from './PmWorkspaceMenu'

interface PmSidebarProps {
  organizationId: string
  sidebarState: SidebarState
  clients: ClientSummary[]
}

// Owns the sidebar's personalization state client-side (seeded from the server-fetched
// bootstrap - see PmSidebarServer) and is the single place that persists it, via the
// existing optimistic saveViewState mutation. Every customizable child (ungrouped items,
// the workspace group) only ever reports "here's the new state" up through `onChange` /
// `commit` - none of them know how or where it's saved. Favourites and Your clients are
// not customizable, so they take plain data props instead.
const PmSidebar = ({
  organizationId,
  sidebarState: initial,
  clients,
}: PmSidebarProps) => {
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
          {ungroupedItems.map((item) => (
            <PmSidebarContextMenu
              key={item.route}
              visible={item.visible}
              onVisibilityChange={(v) =>
                commit(setItemVisibility(sidebarState, item.route, v))
              }
              onCustomize={() => setCustomizeOpen(true)}
              href={resolveHref(item.href)}
            >
              <SidebarMenuItem>
                <PmNavLink
                  href={resolveHref(item.href)}
                  label={item.title}
                  icon={<item.icon className="w-3.5 h-3.5 shrink-0" />}
                />
              </SidebarMenuItem>
            </PmSidebarContextMenu>
          ))}
        </SidebarMenu>
        <PmWorkspaceMenu
          organizationId={organizationId}
          groupState={workspaceGroup}
          sidebarState={sidebarState}
          onChange={commit}
          onCustomize={() => setCustomizeOpen(true)}
        />
        <PmFavoritesList favorites={sidebarState.favorites.items} />
        <PmClientsList organizationId={organizationId} clients={clients} />
      </SidebarContent>

      <PmSidebarCustomizeDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        sidebarState={sidebarState}
        onChange={commit}
      />
    </Sidebar>
  )
}

export default PmSidebar
