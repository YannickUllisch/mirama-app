import type { TableData } from '@src/components/Tables/DataTable'
import { Checkbox } from '@src/components/ui/checkbox'
import { TableBody, TableCell, TableRow } from '@src/components/ui/table'
import {
  type ColumnDef,
  type RowSelectionState,
  type Table,
  flexRender,
} from '@tanstack/react-table'
import { Spinner } from '@ui/spinner'
import React from 'react'

interface DataTableContentProps<TData extends TableData<TData>, TValue> {
  table: Table<TData>
  columns: ColumnDef<TData, TValue>[]
  dataLoading?: boolean
  expandedContent?: React.ReactNode
  enableRowSelection?: boolean
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

const DataTableContent = <TData extends TableData<TData>, TValue>({
  columns,
  table,
  dataLoading,
  enableRowSelection,
}: DataTableContentProps<TData, TValue>) => {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <React.Fragment key={`cell${row.id}`}>
            <TableRow
              key={row.id}
              data-state={enableRowSelection && row.getIsSelected() ? 'selected' : null}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{ minWidth: cell.column.columnDef.minSize }}
                >
                  {cell.column.id === 'select' ? (
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={() => row.toggleSelected()}
                      className="shadcn-checkbox"
                    />
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          </React.Fragment>
        ))
      ) : (
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={columns.length} className="h-36">
            {dataLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Spinner className="bg-text" size="md" />
                <span className="text-sm">Loading data…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                <span className="text-sm font-medium text-foreground">No results found</span>
                <span className="text-xs text-muted-foreground">Try adjusting your filters or search query</span>
              </div>
            )}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}

export default DataTableContent
