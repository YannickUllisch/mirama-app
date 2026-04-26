'use client'

import { Input } from '@src/components/ui/input'
import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import type React from 'react'
import { DateRangeFilter } from './DateRangeFilter'
import { EnumFilter } from './EnumFilter'
import { NumberRangeFilter } from './NumberRangeFilter'

interface FilterBarProps<TData> {
  table: Table<TData>
  globalFilter: {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
  }
}

export const FilterBar = <TData,>({
  table,
  globalFilter,
}: FilterBarProps<TData>) => {
  const filterableColumns = table
    .getAllColumns()
    .filter((col) => col.getIsVisible() && col.columnDef.meta?.filter != null)

  const hasActiveFilters =
    table.getState().columnFilters.length > 0 || globalFilter.value !== ''

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Global search */}
      <Input
        className="h-8 w-40 lg:w-55"
        placeholder="Search…"
        type="text"
        autoComplete="off"
        value={globalFilter.value}
        onChange={(e) => globalFilter.setValue(e.target.value)}
      />

      {/* Per-column filter widgets */}
      {filterableColumns.map((column) => {
        const meta = column.columnDef.meta?.filter
        if (!meta) return null

        switch (meta.type) {
          case 'enum':
            return (
              <EnumFilter
                key={column.id}
                column={column}
                title={meta.title}
                options={meta.options}
              />
            )
          case 'dateRange':
            return (
              <DateRangeFilter
                key={column.id}
                column={column}
                title={meta.title}
              />
            )
          case 'numberRange':
            return (
              <NumberRangeFilter
                key={column.id}
                column={column}
                title={meta.title}
                unit={meta.unit}
              />
            )
          default:
            return null
        }
      })}

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            table.resetColumnFilters()
            globalFilter.setValue('')
          }}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-hover hover:text-foreground transition-colors outline-none"
        >
          <X className="h-3 w-3" />
          Clear all
        </button>
      )}
    </div>
  )
}
