'use client'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@src/components/ui/context-menu'
import { cn } from '@src/lib/utils'
import { Eye, EyeOff, Link2, SlidersHorizontal } from 'lucide-react'
import { cloneElement, isValidElement, useState } from 'react'
import { toast } from 'sonner'

interface PmSidebarContextMenuProps {
  children: React.ReactNode
  visible: boolean
  onVisibilityChange: (visible: boolean) => void
  onCustomize: () => void
  // Fully-resolved (organizationId already substituted) href - omit for targets with no
  // navigable page of their own (e.g. a group header), which drops "Copy link" instead of
  // offering a link that goes nowhere.
  href?: string
}

// One right-click menu, reused for every personalizable sidebar target: ungrouped items,
// workspace-group items, and group headers. Callers only ever supply the current
// visibility + a setter - the resulting SidebarState is assembled by the caller via the
// pure helpers in workspace/sidebar/sidebar.helpers.ts, never here. While the menu is open, the target row
// itself is highlighted (cloned in with the same tokens the sidebar already uses for
// hover/active) so it's obvious which item the menu belongs to.
//
// "Customize sidebar…" defers opening the dialog by a tick (setTimeout) rather than
// calling onCustomize directly: Radix's context menu and dialog both toggle a lock on
// document.body while open, and opening the dialog in the very same event that closes
// the context menu races that lock, leaving the whole page unclickable once the dialog
// is later closed. Letting the menu finish closing first avoids the race entirely.
const PmSidebarContextMenu = ({
  children,
  visible,
  onVisibilityChange,
  onCustomize,
  href,
}: PmSidebarContextMenuProps) => {
  const [open, setOpen] = useState(false)

  const copyLink = () => {
    if (!href) return
    navigator.clipboard.writeText(`${window.location.origin}${href}`)
    toast.success('Link copied')
  }

  const target = isValidElement<{ className?: string }>(children)
    ? cloneElement(children, {
        className: cn(
          children.props.className,
          open && 'rounded-md bg-sidebar-accent text-sidebar-accent-foreground',
        ),
      })
    : children

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger asChild>{target}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Eye className="mr-2 size-3.5" />
            Visibility
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuCheckboxItem
              checked={visible}
              onCheckedChange={() => onVisibilityChange(true)}
            >
              <Eye className="mr-2 size-3.5" />
              Always Show
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={!visible}
              onCheckedChange={() => onVisibilityChange(false)}
            >
              <EyeOff className="mr-2 size-3.5" />
              Don&apos;t show
            </ContextMenuCheckboxItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onSelect={() => setTimeout(onCustomize, 0)}>
          <SlidersHorizontal className="mr-2 size-3.5" />
          Customize sidebar…
        </ContextMenuItem>
        {href && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={copyLink}>
              <Link2 className="mr-2 size-3.5" />
              Copy link
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default PmSidebarContextMenu
