'use client'

import { SidebarMenu, SidebarMenuItem } from '@src/components/ui/sidebar'
import {
  mergeAllSidebarItems,
  type SidebarGroupState,
  type SidebarState,
  setGroupItemVisibility,
  setGroupVisibility,
} from '@src/modules/workspace/sidebar'
import { SIDEBAR_WORKSPACE_GROUP_ITEMS } from '@src/modules/workspace/sidebar.manifest'
import PmNavLink from './PmNavLink'
import PmSidebarCollapsibleGroup from './PmSidebarCollapsibleGroup'
import PmSidebarContextMenu from './PmSidebarContextMenu'
import PmSidebarMore from './PmSidebarMore'

const GROUP_KEY = 'workspace'

const PmWorkspaceMenu = ({
  organizationId,
  groupState,
  sidebarState,
  onChange,
  onCustomize,
}: {
  organizationId: string
  groupState?: SidebarGroupState
  sidebarState: SidebarState
  onChange: (next: SidebarState) => void
  onCustomize: () => void
}) => {
  const visible = groupState?.visible ?? true
  const resolveHref = (href: string) =>
    href.replace('[organizationId]', organizationId)
  const allItems = mergeAllSidebarItems(
    SIDEBAR_WORKSPACE_GROUP_ITEMS,
    groupState?.items ?? [],
  )
  const items = allItems.filter((item) => item.visible)
  const hiddenItems = allItems.filter((item) => !item.visible)

  if (!visible) return null

  return (
    <PmSidebarCollapsibleGroup
      label="Workspace"
      contextMenu={{
        visible,
        onVisibilityChange: (v) =>
          onChange(setGroupVisibility(sidebarState, GROUP_KEY, v)),
        onCustomize,
      }}
    >
      <SidebarMenu>
        {items.map((item) => (
          <PmSidebarContextMenu
            key={item.route}
            visible={item.visible}
            onVisibilityChange={(v) =>
              onChange(
                setGroupItemVisibility(sidebarState, GROUP_KEY, item.route, v),
              )
            }
            onCustomize={onCustomize}
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
        <PmSidebarMore
          onCustomize={onCustomize}
          items={hiddenItems.map((item) => ({
            key: item.route,
            icon: <item.icon className="size-3.5 shrink-0" />,
            label: item.title,
            href: resolveHref(item.href),
          }))}
        />
      </SidebarMenu>
    </PmSidebarCollapsibleGroup>
  )
}

export default PmWorkspaceMenu
