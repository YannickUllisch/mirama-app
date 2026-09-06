'use client'

import { SidebarMenuItem, useSidebar } from '@src/components/ui/sidebar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { Separator } from '@src/components/ui/separator'
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

export interface ShellSidebarMoreItem {
  key: string
  icon: React.ReactNode
  label: string
  // Omit for an item with nothing to navigate to (e.g. a favourite isn't a route yet) -
  // it renders as a plain, non-interactive row instead of a dead link.
  href?: string
}

interface ShellSidebarMoreProps {
  items: ShellSidebarMoreItem[]
  // Only the workspace group's hidden-routes popover uses this: appends a "Customize
  // sidebar" row below a separator.
  onCustomize?: () => void
}

const ShellSidebarMoreRow = ({
  item,
  onNavigate,
}: {
  item: ShellSidebarMoreItem
  onNavigate: () => void
}) => {
  const className =
    'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-body-text transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  return item.href ? (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {item.icon}
      <span className="truncate">{item.label}</span>
    </Link>
  ) : (
    <div className={className}>
      {item.icon}
      <span className="truncate">{item.label}</span>
    </div>
  )
}

// One "... More" affordance, reused wherever a sidebar section has items it can't show
// inline: the workspace group's hidden routes (with a "Customize sidebar" shortcut below
// a separator) and the overflow beyond 3 favourites/clients. A plain, non-modal Popover
// in both cases - callers just hand over the items to list. The sidebar's hover-peek is
// locked open while the popover is open (see ShellProfileMenu for the same pattern), so
// opening it while the collapsed sidebar is only peeking doesn't close it out from under
// the popover.
const ShellSidebarMore = ({ items, onCustomize }: ShellSidebarMoreProps) => {
  const [open, setOpen] = useState(false)
  const { lockPeek } = useSidebar()
  const unlockPeekRef = useRef<(() => void) | null>(null)

  if (items.length === 0) return null

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      unlockPeekRef.current = lockPeek()
    } else {
      unlockPeekRef.current?.()
      unlockPeekRef.current = null
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <SidebarMenuItem>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-xs text-body-text/60 transition-colors hover:bg-sidebar-accent hover:text-ink"
          >
            <MoreHorizontal className="size-3.5 shrink-0" />
            More
          </button>
        </SidebarMenuItem>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <div className="max-h-64 space-y-0.5 overflow-y-auto">
          {items.map((item) => (
            <ShellSidebarMoreRow
              key={item.key}
              item={item}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </div>
        {onCustomize && (
          <>
            <Separator className="my-1" />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onCustomize()
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-body-text/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <SlidersHorizontal className="size-3.5 shrink-0" />
              Customize sidebar…
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default ShellSidebarMore
