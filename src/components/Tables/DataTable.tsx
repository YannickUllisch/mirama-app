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
} from '@/src/components/ui/table'
import { useState } from 'react'
import { Collapsible, CollapsibleContent } from '@src/components/ui/collapsible'
import CollapsibleTasks from './CollapsibleTasks'
import { Button } from '@src/components/ui/button'
import { Wrench } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: boolean
  footer?: React.JSX.Element
  collapsible?: boolean
  columnvisibility?: boolean
  tableHeader?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  footer,
  collapsible,
  columnvisibility,
  tableHeader,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    initialState: { pagination: { pageSize: 10 } },
    defaultColumn: {
      size: 150,
      minSize: 100,
      maxSize: 400,
    },
    columnResizeMode: 'onChange',
  })

  return (
    <div>
      <div>
        <div className="flex items-center m-1 ">
          {tableHeader}
          {columnvisibility ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center hover:bg-neutral-100 rounded-sm dark:hover:bg-neutral-800">
                  <Wrench width={15} className="ml-2" />
                  <Button
                    style={{ fontSize: 11, textDecoration: 'none' }}
                    variant="link"
                  >
                    Column Options
                  </Button>
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
        <Table className="border dark:border-neutral-800">
          <TableHeader className="dark:bg-neutral-900 bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                <Collapsible key={`collapsible${row.id}`} asChild>
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {collapsible && (
                      <CollapsibleContent className="w-20" asChild>
                        <CollapsibleTasks projectId={row.getValue('id')} />
                      </CollapsibleContent>
                    )}
                  </>
                </Collapsible>
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
      {/* {rowselection ? (
        <>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <div className="flex-1 text-sm text-muted-foreground z-5">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          ) : null}
        </>
      ) : null} */}
    </div>
  )
}
