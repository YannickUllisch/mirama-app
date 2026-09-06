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
import ShellNavLink from './ShellNavLink'
import ShellSidebarCollapsibleGroup from './ShellSidebarCollapsibleGroup'
import ShellSidebarContextMenu from './ShellSidebarContextMenu'
import ShellSidebarMore from './ShellSidebarMore'

const GROUP_KEY = 'workspace'

const ShellWorkspaceMenu = ({
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
    <ShellSidebarCollapsibleGroup
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
          <ShellSidebarContextMenu
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
              <ShellNavLink
                href={resolveHref(item.href)}
                label={item.title}
                icon={<item.icon className="w-3.5 h-3.5 shrink-0" />}
              />
            </SidebarMenuItem>
          </ShellSidebarContextMenu>
        ))}
        <ShellSidebarMore
          onCustomize={onCustomize}
          items={hiddenItems.map((item) => ({
            key: item.route,
            icon: <item.icon className="size-3.5 shrink-0" />,
            label: item.title,
            href: resolveHref(item.href),
          }))}
        />
      </SidebarMenu>
    </ShellSidebarCollapsibleGroup>
  )
}

export default ShellWorkspaceMenu
