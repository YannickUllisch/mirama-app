import type { ColumnFiltersState, Table } from '@tanstack/react-table'
import type React from 'react'
import { useState } from 'react'
import { getLocalStorageItem, type TableData } from './DataTable'
import { BasicFilterModel } from '@src/components/Tables/Filters/BasicFilterModel'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@src/components/ui/button'
import { ToolbarViewOptions } from '@src/components/Tables/Toolbar/ToolbarViewOptions'
import ToolbarRefresh from '@src/components/Tables/Toolbar/ToolbarRefresh'

interface DataTableToolBarProps<TData extends TableData> {
  table: Table<TData>
  tableIdentifier: string
  columnFilters: ColumnFiltersState
  toolbarOptions?: {
    refresh?: {
      mutate?: () => any
    }
    addToolbarleft?: React.ReactNode
    addToolbarright?: React.ReactNode
    showFilterOption?: boolean
    filterOptionType?: 'TASK' | 'PROJECT'
  }
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  globalFilter: string
}

const DataTableToolbar = <TData extends TableData>({
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
        {toolbarOptions?.addToolbarleft}
        {toolbarOptions?.showFilterOption && (
          <div
            className="relative flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer"
            onClick={() => setShowFilters((checked) => !checked)}
            onKeyDown={() => setShowFilters((checked) => !checked)}
          >
            {columnFilters.length > 0 || globalFilter !== '' ? (
              <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              </span>
            ) : null}

            <SlidersHorizontal width={15} className="ml-2" />
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              Show Filters
            </Button>
            <ChevronDown
              className={`${
                showFilters ? 'rotate-180' : ''
              } ease-in-out transition w-3 h-3 mr-2`}
            />
          </div>
        )}
        <div className="flex gap-3 items-center">
          {toolbarOptions?.addToolbarright}
          <ToolbarViewOptions table={table} />
          {toolbarOptions?.refresh && (
            <ToolbarRefresh mutate={toolbarOptions.refresh.mutate} />
          )}
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
