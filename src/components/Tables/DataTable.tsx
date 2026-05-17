'use client'
import DataTableContent from '@src/components/Tables/DataTableContent'
import DataTableHeader from '@src/components/Tables/DataTableHeader'
import DataTableToolbar from '@src/components/Tables/DataTableToolbar'
import {
  inDateRangeFilterFn,
  inEnumSetFilterFn,
  inNumberRangeFilterFn,
} from '@src/components/Tables/Filters/filter-fns'
import { DataTablePagination } from '@src/components/Tables/TablePagination'
import { Table } from '@src/components/ui/table'
import type { ServerPaginationProps } from '@src/modules/shared/hooks/helpers'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnSizingState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
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
  serverPagination?: ServerPaginationProps
  toolbarOptions?: {
    refresh?: {
      mutate?: () => any
    }
    addToolbarleft?: React.ReactNode
    addToolbarright?: React.ReactNode
    showFilterOption?: boolean
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
  serverPagination,
  toolbarOptions,
  footerOptions,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    const localStorageItem = getLocalStorageItem({
      item: `${tableIdentifier}-table-sizing`,
    })
    if (localStorageItem) return localStorageItem
    return { items: [] }
  })

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const localStorageItem = getLocalStorageItem({
        item: `${tableIdentifier}-table-visibility`,
      })
      if (localStorageItem) return localStorageItem
      return { items: [] }
    },
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const localStorageItem = getLocalStorageItem({
      item: `${tableIdentifier}-table-filter`,
    })
    if (localStorageItem) return localStorageItem
    return []
  })

  const onColumnFiltersChange = (filterModel: Updater<ColumnFiltersState>) => {
    const newFilters =
      typeof filterModel === 'function'
        ? filterModel(columnFilters)
        : filterModel
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

  const handleServerPaginationChange = serverPagination
    ? (updater: Updater<PaginationState>) => {
        const current: PaginationState = {
          pageIndex: serverPagination.pageIndex,
          pageSize: serverPagination.pageSize,
        }
        const next = typeof updater === 'function' ? updater(current) : updater
        if (next.pageIndex !== current.pageIndex)
          serverPagination.onPageChange(next.pageIndex)
        if (next.pageSize !== current.pageSize)
          serverPagination.onPageSizeChange(next.pageSize)
      }
    : undefined

  const table = useReactTable<TData>({
    data,
    columns,
    filterFns: {
      inEnumSet: inEnumSetFilterFn,
      inDateRange: inDateRangeFilterFn,
      inNumberRange: inNumberRangeFilterFn,
    },
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
    ...(serverPagination && {
      manualPagination: true,
      pageCount: serverPagination.pageCount,
      onPaginationChange: handleServerPaginationChange,
    }),
    state: {
      sorting: sortingState ? sortingState : sorting,
      rowSelection,
      columnVisibility,
      columnSizing,
      columnFilters,
      globalFilter,
      expanded,
      ...(serverPagination && {
        pagination: {
          pageIndex: serverPagination.pageIndex,
          pageSize: serverPagination.pageSize,
        },
      }),
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
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
      {/* Multi-color brand stripe */}
      <div className="flex h-0.5 w-full">
        <div className="flex-1 bg-signature-coral" />
        <div className="flex-1 bg-signature-forest" />
        <div className="flex-1 bg-signature-mint" />
        <div className="flex-1 bg-signature-mustard" />
      </div>
      {/* Toolbar */}
      <div className="border-b border-border/50 bg-card">
        <DataTableToolbar
          tableIdentifier={tableIdentifier}
          toolbarOptions={toolbarOptions}
          columnFilters={columnFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
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

      {/* Pagination */}
      <div className="border-t border-border/50 bg-card">
        <DataTablePagination
          table={table}
          enableRowSelection={enableRowSelection}
          pagination={footerOptions?.showPagination ?? false}
        />
      </div>
    </div>
  )
}
