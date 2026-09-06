'use client'

import { useSidebar } from '@src/components/ui/sidebar'
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
import { Eye, Link2, SlidersHorizontal } from 'lucide-react'
import { cloneElement, isValidElement, useRef, useState } from 'react'
import { toast } from 'sonner'

interface ShellSidebarContextMenuProps {
  children: React.ReactNode
  visible: boolean
  onVisibilityChange: (visible: boolean) => void
  onCustomize: () => void
  href?: string
}

const ShellSidebarContextMenu = ({
  children,
  visible,
  onVisibilityChange,
  onCustomize,
  href,
}: ShellSidebarContextMenuProps) => {
  const [open, setOpen] = useState(false)
  const { lockPeek } = useSidebar()
  const unlockPeekRef = useRef<(() => void) | null>(null)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      unlockPeekRef.current = lockPeek()
    } else {
      unlockPeekRef.current?.()
      unlockPeekRef.current = null
    }
  }

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
    <ContextMenu onOpenChange={handleOpenChange}>
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
              Always Show
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={!visible}
              onCheckedChange={() => onVisibilityChange(false)}
            >
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

export default ShellSidebarContextMenu
