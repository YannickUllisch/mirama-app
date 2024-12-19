import {
  flexRender,
  type RowSelectionState,
  type ColumnDef,
  type Table,
} from '@tanstack/react-table'
import React from 'react'
import type { TableData } from '@src/components/Tables/DataTable'
import { TableBody, TableCell, TableRow } from '@src/components/ui/table'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@src/components/ui/checkbox'

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
              className="group"
              // onClick={(event) => {
              //   const target = event.target as Element
              //   const isCheckbox = target.closest('.shadcn-checkbox')

              //   if (isCheckbox) {
              //     row.toggleSelected()
              //   } else {
              //     if (event.shiftKey) {
              //       row.toggleSelected()
              //     } else {
              //       if (onRowSelectionChange) {
              //         onRowSelectionChange({})
              //       }
              //       if (enableRowSelection) {
              //         row.toggleSelected()
              //       }
              //     }
              //   }
              // }}
              data-state={
                enableRowSelection && row.getIsSelected() ? 'selected' : null
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    // width: cell.column.getSize(),
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
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
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
  )
}

export default DataTableContent
