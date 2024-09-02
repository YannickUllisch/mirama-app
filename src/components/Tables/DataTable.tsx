'use client'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
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
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@src/components/ui/table'
import React from 'react'
import { useState } from 'react'
import {
  ChevronDown,
  GripVertical,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react'
import { Checkbox } from '@src/components/ui/checkbox'
import { DataTablePagination } from './TablePagination'
import { Button } from '../ui/button'
import { ToolbarViewOptions } from './ToolbarViewOptions'
import ToolbarRefresh from './ToolbarRefresh'
import { BasicFilterModel } from '@src/components/Tables/Filters/BasicFilterModel'

interface TableData {
  id: string
}

interface DataTableProps<TData extends TableData, TValue> {
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
    showViewOptionsicon?: boolean
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
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [colSizing, setColSizing] = useState<ColumnSizingState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)

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
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => true,
    enableColumnResizing: true,
    onColumnSizingChange: setColSizing,
    columnResizeMode: 'onChange',
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    state: {
      sorting: sortingState ? sortingState : sorting,
      rowSelection,
      columnVisibility,
      columnSizing: colSizing,
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
    <div>
      <div>
        <div className="flex items-center m-1 outline-none justify-between ">
          <div className="flex">
            {toolbarOptions?.addToolbarleft}
            {toolbarOptions?.showFilterOption && (
              <div
                className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer"
                onClick={() => setShowFilters((checked) => !checked)}
                onKeyDown={() => setShowFilters((checked) => !checked)}
              >
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
          </div>
          <div className="flex gap-3 items-center">
            <>
              {toolbarOptions?.addToolbarright}
              {toolbarOptions?.showViewOptionsicon && (
                <ToolbarViewOptions table={table} />
              )}
              {toolbarOptions?.refresh && (
                <ToolbarRefresh mutate={toolbarOptions.refresh.mutate} />
              )}
            </>
          </div>
        </div>

        {showFilters && (
          <div className="m-2">
            <BasicFilterModel
              table={table}
              globalFilter={{ value: globalFilter, setValue: setGlobalFilter }}
              filterModelType={toolbarOptions?.filterOptionType}
            />
          </div>
        )}

        <Table className="border dark:border-neutral-800 overflow-scroll">
          <TableHeader className="dark:bg-neutral-900 bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="headerGroup group">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="relative"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanResize() && (
                        <div className="absolute top-3.5 right-0 h-full">
                          <GripVertical
                            className="cursor-col-resize bg-neutral-800 invisible group-hover:w-5 group-hover:visible transition-all ease-in-out duration-150"
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            style={{
                              height: '30%',
                              userSelect: 'none',
                              justifyContent: 'center',
                              backgroundColor: 'inherit',
                              alignItems: 'center',
                              touchAction: 'none',
                            }}
                          />
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={`cell${row.id}`}>
                  <TableRow
                    key={row.id}
                    className="group"
                    onClick={(event) => {
                      const target = event.target as Element
                      const isCheckbox = target.closest('.shadcn-checkbox')

                      if (isCheckbox) {
                        row.toggleSelected()
                      } else {
                        if (event.shiftKey) {
                          row.toggleSelected()
                        } else {
                          if (onRowSelectionChange) {
                            onRowSelectionChange({})
                          }
                          if (enableRowSelection) {
                            row.toggleSelected()
                          }
                        }
                      }
                    }}
                    data-state={
                      enableRowSelection && row.getIsSelected()
                        ? 'selected'
                        : null
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                        }}
                      >
                        {cell.column.id === 'select' ? (
                          <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={() => row.toggleSelected()}
                            className="shadcn-checkbox"
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {enableRowSelection && row.getIsExpanded() && (
                    <TableRow>
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className=""
                      >
                        {expandedContent}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {dataLoading ? (
                    <div className="flex w-full align-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin dark:text-white" />
                    </div>
                  ) : (
                    'No results.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footerOptions?.addFooterRow}
        </Table>
      </div>
      <DataTablePagination
        table={table}
        enableRowSelection={enableRowSelection}
        pagination={footerOptions?.showPagination ?? false}
      />
    </div>
  )
}
