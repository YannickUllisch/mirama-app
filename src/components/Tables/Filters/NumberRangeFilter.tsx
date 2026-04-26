'use client'

import { Input } from '@src/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { cn } from '@src/lib/utils'
import type { Column } from '@tanstack/react-table'
import { Label } from '@ui/label'
import { ChevronDown, Hash, X } from 'lucide-react'

interface NumberRangeFilterProps<TData> {
  column: Column<TData, unknown>
  title: string
  unit?: string
}

export const NumberRangeFilter = <TData,>({
  column,
  title,
  unit,
}: NumberRangeFilterProps<TData>) => {
  const filterValue = column.getFilterValue() as
    | [number | '', number | '']
    | undefined
  const min = filterValue?.[0] ?? ''
  const max = filterValue?.[1] ?? ''
  const isActive = min !== '' || max !== ''

  const update = (nextMin: number | '', nextMax: number | '') => {
    if (nextMin === '' && nextMax === '') {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue([nextMin, nextMax])
    }
  }

  const label = isActive
    ? min !== '' && max !== ''
      ? `${unit ?? ''}${min} – ${unit ?? ''}${max}`
      : min !== ''
        ? `≥ ${unit ?? ''}${min}`
        : `≤ ${unit ?? ''}${max}`
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
          <Hash className="h-3.5 w-3.5 shrink-0" />
          <span className="max-w-35 truncate">{label}</span>
          {isActive ? (
            <button
              type="button"
              tabIndex={0}
              aria-label="Clear number filter"
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

      <PopoverContent align="start" className="w-52 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          {title}
          {unit ? ` (${unit})` : ''}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              Min
            </Label>
            <Input
              type="number"
              placeholder="0"
              className="h-7 text-xs"
              value={min}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value)
                update(val, max)
              }}
            />
          </div>
          <span className="text-muted-foreground mt-4 text-xs">–</span>
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              Max
            </Label>
            <Input
              type="number"
              placeholder="∞"
              className="h-7 text-xs"
              value={max}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value)
                update(min, val)
              }}
            />
          </div>
        </div>
        {isActive && (
          <button
            type="button"
            onClick={() => column.setFilterValue(undefined)}
            className="mt-2 w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Clear filter
          </button>
        )}
      </PopoverContent>
    </Popover>
  )
}
