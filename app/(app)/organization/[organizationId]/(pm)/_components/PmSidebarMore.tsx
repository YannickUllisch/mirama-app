'use client'

import { SidebarMenuItem } from '@src/components/animate-ui/components/radix/sidebar'
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/ui/popover'
import { Separator } from '@src/components/ui/separator'
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export interface PmSidebarMoreItem {
  key: string
  icon: React.ReactNode
  label: string
  // Omit for an item with nothing to navigate to (e.g. a favourite isn't a route yet) -
  // it renders as a plain, non-interactive row instead of a dead link.
  href?: string
}

interface PmSidebarMoreProps {
  items: PmSidebarMoreItem[]
  // Only the workspace group's hidden-routes popover uses this: appends a "Customize
  // sidebar" row below a separator.
  onCustomize?: () => void
}

const PmSidebarMoreRow = ({
  item,
  onNavigate,
}: {
  item: PmSidebarMoreItem
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
// in both cases - callers just hand over the items to list.
const PmSidebarMore = ({ items, onCustomize }: PmSidebarMoreProps) => {
  const [open, setOpen] = useState(false)
  if (items.length === 0) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <PmSidebarMoreRow key={item.key} item={item} onNavigate={() => setOpen(false)} />
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

export default PmSidebarMore
