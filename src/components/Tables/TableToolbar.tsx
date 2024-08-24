'use client'
import type { Table } from '@tanstack/react-table'
import { Input } from '@src/components/ui/input'
import { DataTableFacetedFilter } from './FacetedFilter'
import { Button } from '../ui/button'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  CircleIcon,
  Cross,
  CrossIcon,
  StopCircle,
} from 'lucide-react'
import { PriorityType, TaskStatusType } from '@prisma/client'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={Object.keys(TaskStatusType).map((status) => {
              return { label: status, value: status, icon: ArrowDown }
            })}
          />
        )}
        {table.getColumn('priority') && (
          <DataTableFacetedFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={Object.keys(PriorityType).map((priority) => {
              return { label: priority, value: priority, icon: CircleIcon }
            })}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <CrossIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
