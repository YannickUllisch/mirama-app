'use client'
import type { Table } from '@tanstack/react-table'
import { Input } from '@src/components/ui/input'
import { DataTableFacetedFilter } from './FacetedFilter'
import { Button } from '@src/components/ui/button'
import { ArrowDown, CircleIcon } from 'lucide-react'
import { PriorityType, TaskStatusType } from '@prisma/client'
import { capitalize } from '@src/lib/utils'

interface TaskFilterModelProps<TData> {
  table: Table<TData>
}

export function TaskFilterModel<TData>({ table }: TaskFilterModelProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter task..."
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
              return {
                label: capitalize(status.replace('_', ' ')) as string,
                value: status,
              }
            })}
          />
        )}
        {table.getColumn('priority') && (
          <DataTableFacetedFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={Object.keys(PriorityType).map((priority) => {
              return {
                label: capitalize(priority.replace('_', ' ')) as string,
                value: priority,
              }
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
          </Button>
        )}
      </div>
    </div>
  )
}
