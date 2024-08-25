'use client'
import type { Table } from '@tanstack/react-table'
import { Input } from '@src/components/ui/input'
import { DataTableFacetedFilter } from './FacetedFilter'
import { Button } from '@src/components/ui/button'
import { ArrowDown, CircleIcon } from 'lucide-react'
import { PriorityType, StatusType } from '@prisma/client'

interface ProjectFilterModelProps<TData> {
  table: Table<TData>
}

export function ProjectFilterModel<TData>({
  table,
}: ProjectFilterModelProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Project..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={Object.keys(StatusType).map((status) => {
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
          </Button>
        )}
      </div>
    </div>
  )
}
