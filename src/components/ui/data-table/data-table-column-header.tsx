'use client'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { cn } from '@src/lib/utils'
import type { Column } from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  Pin,
  PinOff,
  X,
} from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>
  label: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide() && !column.getCanPin()) {
    return <div className={cn(className)}>{label}</div>
  }

  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const isPinned = column.getIsPinned()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          '-ml-1.5 flex h-7 items-center gap-1 rounded-md px-1.5 py-1 text-xs hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
          className,
        )}
        {...props}
      >
        {label}
        {canSort &&
          (column.getIsSorted() === 'desc' ? (
            <ChevronDown />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {canSort && (
          <>
            <DropdownMenuCheckboxItem
              className="relative gap-1.5 pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === 'asc'}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative gap-1.5 pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === 'desc'}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="gap-1.5 pl-2 [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
                onClick={() => column.clearSorting()}
              >
                <X />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {(canPin || canHide) && canSort && <DropdownMenuSeparator />}
        {canPin && (
          <>
            {isPinned !== 'left' && (
              <DropdownMenuItem
                className="gap-1.5 pl-2 [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
                onClick={() => column.pin('left')}
              >
                <Pin className="-rotate-90" />
                Pin left
              </DropdownMenuItem>
            )}
            {isPinned !== 'right' && (
              <DropdownMenuItem
                className="gap-1.5 pl-2 [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
                onClick={() => column.pin('right')}
              >
                <Pin className="rotate-90" />
                Pin right
              </DropdownMenuItem>
            )}
            {isPinned && (
              <DropdownMenuItem
                className="gap-1.5 pl-2 [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
                onClick={() => column.pin(false)}
              >
                <PinOff />
                Unpin
              </DropdownMenuItem>
            )}
          </>
        )}
        {canHide && (
          <DropdownMenuCheckboxItem
            className="relative gap-1.5 pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
