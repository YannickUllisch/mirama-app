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
    <TableBody className="overflow-auto">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <React.Fragment key={`cell${row.id}`}>
            <TableRow
              key={row.id}
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
                  className="group"
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
                <Spinner className="bg-text" size={'md'} />
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
