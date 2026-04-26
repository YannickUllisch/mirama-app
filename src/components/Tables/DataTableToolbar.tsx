import { FilterBar } from '@src/components/Tables/Filters/FilterBar'
import { ToolbarViewOptions } from '@src/components/Tables/Toolbar/ToolbarViewOptions'
import { cn } from '@src/lib/utils'
import type { ColumnFiltersState, Table } from '@tanstack/react-table'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { getLocalStorageItem, type TableData } from './DataTable'

interface DataTableToolBarProps<TData extends TableData<TData>> {
  table: Table<TData>
  tableIdentifier: string
  columnFilters: ColumnFiltersState
  toolbarOptions?: {
    addToolbarleft?: React.ReactNode
    addToolbarright?: React.ReactNode
    showFilterOption?: boolean
  }
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  globalFilter: string
}

const DataTableToolbar = <TData extends TableData<TData>>({
  globalFilter,
  setGlobalFilter,
  table,
  tableIdentifier,
  columnFilters,
  toolbarOptions,
}: DataTableToolBarProps<TData>) => {
  const [showFilters, setShowFilters] = useState<boolean>(() => {
    const localStorageItem = getLocalStorageItem({
      item: `${tableIdentifier}-table-filter`,
    }) as ColumnFiltersState
    if (localStorageItem) return localStorageItem.length > 0
    return false
  })

  const hasActiveFilters = columnFilters.length > 0 || globalFilter !== ''

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          {toolbarOptions?.addToolbarleft}

          {toolbarOptions?.showFilterOption && (
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={cn(
                'relative inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border text-xs font-medium transition-colors outline-none select-none',
                'focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]',
                showFilters
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border bg-card text-text-secondary hover:bg-hover hover:text-foreground hover:border-border',
              )}
            >
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              )}
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold">
                  {columnFilters.length + (globalFilter ? 1 : 0)}
                </span>
              )}
              <ChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform duration-200 text-muted-foreground',
                  showFilters && 'rotate-180',
                )}
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {toolbarOptions?.addToolbarright}
          <ToolbarViewOptions table={table} />
        </div>
      </div>

      {showFilters && (
        <div className="border-t border-border px-3 pb-2.5 pt-2 bg-card/60">
          <FilterBar
            table={table}
            globalFilter={{ value: globalFilter, setValue: setGlobalFilter }}
          />
        </div>
      )}
    </>
  )
}

export default DataTableToolbar
