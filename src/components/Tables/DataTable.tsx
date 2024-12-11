'use client'
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  type VisibilityState,
  type RowSelectionState,
  type ColumnSizingState,
  type ColumnFiltersState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  type Updater,
} from '@tanstack/react-table'
import { Table } from '@src/components/ui/table'
import type React from 'react'
import { useState } from 'react'
import { DataTablePagination } from '@src/components/Tables/TablePagination'
import DataTableContent from '@src/components/Tables/DataTableContent'
import DataTableHeader from '@src/components/Tables/DataTableHeader'
import DataTableToolbar from './DataTableToolbar'

export interface TableData {
  id: string
}

// Persistance, fetching states from Local Storage
export const getLocalStorageItem = ({ item }: { item: string }) => {
  if (typeof window === 'undefined') return null
  const savedFilters = localStorage.getItem(item)
  return savedFilters ? JSON.parse(savedFilters) : null
}

interface DataTableProps<TData extends TableData, TValue> {
  tableIdentifier: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  dataLoading?: boolean
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

export function DataTable<TData extends TableData, TValue>({
  columns,
  data,
  tableIdentifier,
  dataLoading,
  sortingState,
  setSortingState,
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
  expandedContent,
  toolbarOptions,
  footerOptions,
}: DataTableProps<TData, TValue>) {
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

  const table = useReactTable({
    data,
    columns,
    // Sets row ID to the ID of the given data.
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSortingState ? setSortingState : setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange,
    onColumnVisibilityChange,
    getRowCanExpand: () => true,
    enableColumnResizing: true,
    onColumnSizingChange: onColumnSizingChange,
    columnResizeMode: 'onChange',
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: onColumnFiltersChange,
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    state: {
      sorting: sortingState ? sortingState : sorting,
      rowSelection,
      columnVisibility,
      columnSizing,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 10 },
      sorting: sortingState ? sortingState : sorting,
    },
    defaultColumn: {
      size: 25,
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
      <Table>
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
      <DataTablePagination
        table={table}
        enableRowSelection={enableRowSelection}
        pagination={footerOptions?.showPagination ?? false}
      />
    </>
  )
}
