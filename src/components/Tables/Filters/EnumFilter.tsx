'use client'

import { Badge } from '@src/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@src/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/ui/popover'
import { cn } from '@src/lib/utils'
import type { Column } from '@tanstack/react-table'
import { Check, ChevronDown, ListFilter } from 'lucide-react'
import type { EnumFilterOption } from './column-filter-meta'

interface EnumFilterProps<TData> {
  column: Column<TData, unknown>
  title: string
  options: EnumFilterOption[]
}

export const EnumFilter = <TData,>({ column, title, options }: EnumFilterProps<TData>) => {
  const facets = column.getFacetedUniqueValues()
  const selected = new Set((column.getFilterValue() as string[] | undefined) ?? [])
  const isActive = selected.size > 0

  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    column.setFilterValue(next.size > 0 ? Array.from(next) : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full border text-xs font-medium transition-colors outline-none select-none',
            isActive
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-border bg-card text-text-secondary hover:bg-hover hover:text-foreground',
          )}
        >
          <ListFilter className="h-3.5 w-3.5 shrink-0" />
          <span>{title}</span>
          {isActive && (
            <>
              <span className="h-3 w-px bg-primary/30 mx-0.5" />
              {selected.size > 2 ? (
                <Badge variant="secondary" className="h-4 px-1.5 rounded-full text-[10px] font-semibold">
                  {selected.size}
                </Badge>
              ) : (
                <div className="flex gap-1">
                  {options
                    .filter((o) => selected.has(o.value))
                    .map((o) => (
                      <Badge
                        key={o.value}
                        variant="secondary"
                        className="h-4 px-1.5 rounded-full text-[10px] font-semibold"
                      >
                        {o.label}
                      </Badge>
                    ))}
                </div>
              )}
            </>
          )}
          <ChevronDown className="h-3 w-3 shrink-0 ml-0.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-52 p-0">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}…`} className="h-8 text-sm" />
          <CommandList>
            <CommandEmpty>
              <span className="text-xs text-muted-foreground">No options found</span>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.has(option.value)
                const count = facets.get(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggle(option.value)}
                    className="flex items-center justify-between gap-2 cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-border',
                        )}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                      </div>
                      {option.icon && (
                        <option.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span>{option.label}</span>
                    </div>
                    {count != null && (
                      <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                        {count}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {isActive && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-xs text-muted-foreground cursor-pointer"
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
