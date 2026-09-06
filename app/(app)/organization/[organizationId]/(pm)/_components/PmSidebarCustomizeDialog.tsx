'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@src/components/animate-ui/components/radix/dialog'
import { Switch } from '@src/components/animate-ui/components/radix/switch'
import { Button } from '@src/components/ui/button'
import { Separator } from '@src/components/ui/separator'
import {
  mergeAllSidebarItems,
  moveOrderedItem,
  type ResolvedSidebarItem,
  type SidebarState,
  setGroupItemVisibility,
  setGroupVisibility,
  setItemVisibility,
  toItemState,
} from '@src/modules/workspace/sidebar'
import {
  SIDEBAR_ITEMS,
  SIDEBAR_WORKSPACE_GROUP_ITEMS,
  type SidebarManifestItem,
} from '@src/modules/workspace/sidebar.manifest'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface PmSidebarCustomizeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sidebarState: SidebarState
  onChange: (next: SidebarState) => void
}

const Row = ({
  item,
  visible,
  onToggle,
  onMoveUp,
  onMoveDown,
}: {
  item:
    | { title: string; icon: SidebarManifestItem['icon'] }
    | { title: string; icon?: never }
  visible: boolean
  onToggle: (visible: boolean) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}) => (
  <div className="flex items-center gap-2 py-1.5">
    {item.icon && <item.icon className="size-3.5 shrink-0 text-body-text/60" />}
    <span className="flex-1 truncate text-sm">{item.title}</span>
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        disabled={!onMoveUp}
        onClick={onMoveUp}
      >
        <ChevronUp className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        disabled={!onMoveDown}
        onClick={onMoveDown}
      >
        <ChevronDown className="size-3" />
      </Button>
    </div>
    <Switch checked={visible} onCheckedChange={onToggle} />
  </div>
)

// Everything the sidebar's routes can be customized on, in one place - grouped exactly
// like the sidebar itself. Favourites and Your clients are intentionally not here: they
// aren't user-customizable sections. No drag-and-drop (up/down buttons instead) to keep
// this small; every action produces a full SidebarState via the pure helpers in
// workspace/sidebar/sidebar.helpers.ts and hands it straight to onChange (PmSidebar owns persisting it).
const PmSidebarCustomizeDialog = ({
  open,
  onOpenChange,
  sidebarState,
  onChange,
}: PmSidebarCustomizeDialogProps) => {
  const ungroupedItems = mergeAllSidebarItems(SIDEBAR_ITEMS, sidebarState.items)

  const workspaceGroup = sidebarState.groups.find(
    (g) => g.group === 'workspace',
  )
  const workspaceItems = mergeAllSidebarItems(
    SIDEBAR_WORKSPACE_GROUP_ITEMS,
    workspaceGroup?.items ?? [],
  )
  const workspaceVisible = workspaceGroup?.visible ?? true

  const moveUngrouped = (index: number, direction: -1 | 1) =>
    onChange({
      ...sidebarState,
      items: moveOrderedItem(
        ungroupedItems as ResolvedSidebarItem<unknown>[],
        index,
        direction,
      ).map(toItemState),
    })

  const moveWorkspace = (index: number, direction: -1 | 1) =>
    onChange({
      ...sidebarState,
      groups: sidebarState.groups.map((g) =>
        g.group === 'workspace'
          ? {
              ...g,
              items: moveOrderedItem(
                workspaceItems as ResolvedSidebarItem<unknown>[],
                index,
                direction,
              ).map(toItemState),
            }
          : g,
      ),
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <DialogHeader>
          <DialogTitle>Customize sidebar</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          <section>
            <p className="mb-1 text-xs font-medium text-body-text/60">Menu</p>
            {ungroupedItems.map((item, index) => (
              <Row
                key={item.route}
                item={item}
                visible={item.visible}
                onToggle={(v) =>
                  onChange(setItemVisibility(sidebarState, item.route, v))
                }
                onMoveUp={
                  index > 0 ? () => moveUngrouped(index, -1) : undefined
                }
                onMoveDown={
                  index < ungroupedItems.length - 1
                    ? () => moveUngrouped(index, 1)
                    : undefined
                }
              />
            ))}
          </section>

          <Separator />

          <section>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-body-text/60">Workspace</p>
              <Switch
                checked={workspaceVisible}
                onCheckedChange={(v) =>
                  onChange(setGroupVisibility(sidebarState, 'workspace', v))
                }
              />
            </div>
            {workspaceVisible &&
              workspaceItems.map((item, index) => (
                <Row
                  key={item.route}
                  item={item}
                  visible={item.visible}
                  onToggle={(v) =>
                    onChange(
                      setGroupItemVisibility(
                        sidebarState,
                        'workspace',
                        item.route,
                        v,
                      ),
                    )
                  }
                  onMoveUp={
                    index > 0 ? () => moveWorkspace(index, -1) : undefined
                  }
                  onMoveDown={
                    index < workspaceItems.length - 1
                      ? () => moveWorkspace(index, 1)
                      : undefined
                  }
                />
              ))}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PmSidebarCustomizeDialog
