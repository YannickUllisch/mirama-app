'use client'

import { Calendar } from '@src/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { cn } from '@src/lib/utils'
import type { Column } from '@tanstack/react-table'
import { CalendarDays, ChevronDown, X } from 'lucide-react'
import { DateTime } from 'luxon'
import type { DateRange } from 'react-day-picker'

interface DateRangeFilterProps<TData> {
  column: Column<TData, unknown>
  title: string
}

export const DateRangeFilter = <TData,>({
  column,
  title,
}: DateRangeFilterProps<TData>) => {
  const filterValue = column.getFilterValue() as
    | [Date | null, Date | null]
    | undefined
  const from = filterValue?.[0] ?? undefined
  const to = filterValue?.[1] ?? undefined
  const isActive = from != null || to != null

  const onSelect = (range: DateRange | undefined) => {
    if (!range || (!range.from && !range.to)) {
      column.setFilterValue(undefined)
      return
    }
    column.setFilterValue([range.from ?? null, range.to ?? null])
  }

  const formatDate = (d: Date) => DateTime.fromJSDate(d).toFormat('dd MMM yyyy')

  const label = isActive
    ? from && to
      ? `${formatDate(from)} - ${formatDate(to)}`
      : from
        ? `From ${formatDate(from)}`
        : `Until ${to ? formatDate(to) : '---'}`
    : title

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
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span className="max-w-45 truncate">{label}</span>
          {isActive ? (
            <button
              type="button"
              tabIndex={0}
              aria-label="Clear date filter"
              className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                column.setFilterValue(undefined)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  column.setFilterValue(undefined)
                }
              }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          ) : (
            <ChevronDown className="h-3 w-3 shrink-0 ml-0.5 text-muted-foreground" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={onSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
