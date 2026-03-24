import { BasicFilterModel } from '@src/components/Tables/Filters/BasicFilterModel'
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
    filterOptionType?: 'TASK' | 'PROJECT'
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
  // Just used to determine if filters field should be expanded or not
  const [showFilters, setShowFilters] = useState<boolean>(() => {
    // We ensure the filters menu is open, when filters are selected
    const localStorageItem = getLocalStorageItem({
      item: `${tableIdentifier}-table-filter`,
    }) as ColumnFiltersState

    if (localStorageItem) return localStorageItem.length > 0

    return false
  })

  return (
    <>
      <div className="flex items-center m-1 outline-none justify-between ">
        <div className="flex gap-2">
          {toolbarOptions?.addToolbarleft}
          {toolbarOptions?.showFilterOption && (
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={cn(
                'group relative flex items-center gap-2 px-3 h-9 rounded-xl transition-all duration-200 outline-none select-none',
                'bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-sm',

                showFilters
                  ? 'border-primary/40 bg-primary/5 text-primary'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900',

                'focus-visible:ring-4 focus-visible:ring-primary/10 active:scale-[0.98]',
              )}
            >
              {(columnFilters.length > 0 || globalFilter !== '') && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border-2 border-white dark:border-[#0a0a0a]" />
                </span>
              )}

              <SlidersHorizontal
                className={cn(
                  'w-3.5 h-3.5 transition-colors',
                  showFilters
                    ? 'text-primary'
                    : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300',
                )}
              />

              <span className="text-[10px] font-black uppercase tracking-widest">
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </span>

              <ChevronDown
                className={cn(
                  'w-3 h-3 transition-transform duration-300 ease-in-out text-neutral-400',
                  showFilters && 'rotate-180 text-primary',
                )}
              />
            </button>
          )}
        </div>
        <div className="flex gap-1 items-center">
          {toolbarOptions?.addToolbarright}
          <ToolbarViewOptions table={table} />
        </div>
      </div>

      {showFilters && (
        <BasicFilterModel
          table={table}
          globalFilter={{ value: globalFilter, setValue: setGlobalFilter }}
          filterModelType={toolbarOptions?.filterOptionType}
        />
      )}
    </>
  )
}

export default DataTableToolbar
