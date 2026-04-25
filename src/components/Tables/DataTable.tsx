'use client'
import DataTableContent from '@src/components/Tables/DataTableContent'
import DataTableHeader from '@src/components/Tables/DataTableHeader'
import DataTableToolbar from '@src/components/Tables/DataTableToolbar'
import { DataTablePagination } from '@src/components/Tables/TablePagination'
import { Table } from '@src/components/ui/table'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnSizingState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type React from 'react'
import { useState } from 'react'

export interface TableData<TData> {
  id: string
  subtasks?: TData[]
  parentId?: string
}

// Persistance, fetching states from Local Storage
export const getLocalStorageItem = ({ item }: { item: string }) => {
  if (typeof window === 'undefined') return null
  const savedFilters = localStorage.getItem(item)
  return savedFilters ? JSON.parse(savedFilters) : null
}

interface DataTableProps<TData extends TableData<TData>> {
  tableIdentifier: string
  columns: ColumnDef<TData, any>[]
  data: TData[]
  dataLoading?: boolean
  ignoreSubrows?: boolean
  sortingState?: SortingState
  setSortingState?: React.Dispatch<React.SetStateAction<SortingState>>
  enableRowSelection?: boolean
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>
  rowSelection?: RowSelectionState
  expandedContent?: React.ReactNode
  toolbarOptions?: {
    refresh?: {
      mutate?: () => any
    }
    addToolbarleft?: React.ReactNode
    addToolbarright?: React.ReactNode
    showFilterOption?: boolean
    filterOptionType?: 'TASK' | 'PROJECT'
  }

  footerOptions?: {
    showPagination?: boolean
    addFooterRow?: React.JSX.Element
  }
}

export const DataTable = <TData extends TableData<TData>>({
  columns,
  data,
  tableIdentifier,
  dataLoading,
  ignoreSubrows,
  sortingState,
  setSortingState,
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
  expandedContent,
  toolbarOptions,
  footerOptions,
}: DataTableProps<TData>) => {
  // States
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    // Check the localStorage if a filterModel is defined
    const localStorageItem = getLocalStorageItem({
      item: `${tableIdentifier}-table-sizing`,
    })

    if (localStorageItem) return localStorageItem

    return { items: [] }
  })

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      // Check the localStorage if a filterModel is defined
      const localStorageItem = getLocalStorageItem({
        item: `${tableIdentifier}-table-visibility`,
      })

      if (localStorageItem) return localStorageItem

      return { items: [] }
    },
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    // Local storage needs to be defined
    const localStorageItem = getLocalStorageItem({
      item: `${tableIdentifier}-table-filter`,
    })

    if (localStorageItem) return localStorageItem

    return []
  })

  const onColumnFiltersChange = (filterModel: Updater<ColumnFiltersState>) => {
    // Convert to columnfiltersstate
    const newFilters =
      typeof filterModel === 'function'
        ? filterModel(columnFilters)
        : filterModel

    // Save new filter in localStorage
    localStorage.setItem(
      `${tableIdentifier}-table-filter`,
      JSON.stringify(newFilters),
    )
    setColumnFilters(newFilters)
  }

  const onColumnVisibilityChange = (
    visibilityModel: Updater<VisibilityState>,
  ) => {
    const newVisibilityState =
      typeof visibilityModel === 'function'
        ? visibilityModel(columnVisibility)
        : visibilityModel

    localStorage.setItem(
      `${tableIdentifier}-table-visibility`,
      JSON.stringify(newVisibilityState),
    )
    setColumnVisibility(newVisibilityState)
  }

  const onColumnSizingChange = (
    columnSizeModel: Updater<ColumnSizingState>,
  ) => {
    const newColSizeState =
      typeof columnSizeModel === 'function'
        ? columnSizeModel(columnSizing)
        : columnSizeModel

    localStorage.setItem(
      `${tableIdentifier}-table-sizing`,
      JSON.stringify(newColSizeState),
    )
    setColumnSizing(newColSizeState)
  }

  const [expanded, setExpanded] = useState({})

  const table = useReactTable<TData>({
    data,
    columns,
    // Sets row ID to the ID of the given data.
    getRowId: (row, _, parent) =>
      parent ? [parent.id, row.id].join('.') : row.id,
    getSubRows: (row) => (!ignoreSubrows ? row.subtasks || [] : undefined),
    getRowCanExpand: (row) => row.subRows && row.subRows.length > 0,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSortingState ? setSortingState : setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange,
    onColumnVisibilityChange,
    enableColumnResizing: true,
    onColumnSizingChange: onColumnSizingChange,
    columnResizeMode: 'onChange',
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: onColumnFiltersChange,
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    filterFromLeafRows: true,

    state: {
      sorting: sortingState ? sortingState : sorting,
      rowSelection,
      columnVisibility,
      columnSizing,
      columnFilters,
      globalFilter,
      expanded,
    },
    initialState: {
      pagination: { pageSize: 10 },

      sorting: sortingState ? sortingState : sorting,
    },
    defaultColumn: {
      minSize: 0,
      maxSize: 600,
    },
  })

  return (
    <>
      <DataTableToolbar
        tableIdentifier={tableIdentifier}
        toolbarOptions={toolbarOptions}
        columnFilters={columnFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
      />
      <div className="w-full overflow-x-auto border-r border-l">
        <div className="min-w-max">
          <Table className="min-w-full table-auto">
            <DataTableHeader table={table} />
            <DataTableContent
              columns={columns}
              table={table}
              dataLoading={dataLoading}
              enableRowSelection={enableRowSelection}
              expandedContent={expandedContent}
              onRowSelectionChange={onRowSelectionChange}
            />
            {footerOptions?.addFooterRow}
          </Table>
        </div>
      </div>
      <DataTablePagination
        table={table}
        enableRowSelection={enableRowSelection}
        pagination={footerOptions?.showPagination ?? false}
      />
    </>
  )
}
