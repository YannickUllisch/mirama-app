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
} from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
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
import { Button } from '@src/components/ui/button'
import { ArrowDown, ChevronDown, GripVertical, Wrench } from 'lucide-react'
import { Checkbox } from '@src/components/ui/checkbox'

interface TableData {
  id: string
}

interface DataTableProps<TData extends TableData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: boolean
  enableRowSelection?: boolean
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>
  rowSelection?: RowSelectionState
  footer?: React.JSX.Element
  columnvisibility?: boolean
  tableHeader?: React.ReactNode
  expandedContent?: React.ReactNode
}

export function DataTable<TData extends TableData, TValue>({
  columns,
  data,
  pagination,
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
  footer,
  expandedContent,
  columnvisibility,
  tableHeader,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [colSizing, setColSizing] = useState<ColumnSizingState>({})

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    // Sets row ID to the ID of the given data.
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
    onRowSelectionChange,
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => true,
    enableColumnResizing: true,
    onColumnSizingChange: setColSizing,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnSizing: colSizing,
    },
    initialState: { pagination: { pageSize: 10 } },
    defaultColumn: {
      size: 25,
      maxSize: 600,
    },
  })

  return (
    <div>
      <div>
        <div className="flex items-center m-1 outline-none ">
          {tableHeader}
          {columnvisibility ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center hover:bg-neutral-100 rounded-sm dark:hover:bg-neutral-800">
                  <Wrench width={15} className="ml-2" />
                  <Button
                    style={{
                      fontSize: 11,
                      textDecoration: 'none',
                      padding: 10,
                    }}
                    variant="link"
                  >
                    Column Options
                  </Button>
                  <ChevronDown width={15} className="mr-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <Table
          className="border dark:border-neutral-800 overflow-scroll"
          // style={{ width: table.getTotalSize() }}
        >
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footer}
        </Table>
      </div>
      {pagination ? (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            className="dark:bg-inherit"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="dark:bg-inherit"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      ) : null}

      {enableRowSelection &&
      table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <div className="flex-1 text-sm text-muted-foreground z-5">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      ) : null}
    </div>
  )
}
