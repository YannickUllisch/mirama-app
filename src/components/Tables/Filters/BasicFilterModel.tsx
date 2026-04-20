'use client'
import {
  PriorityType,
  StatusType,
  TaskStatusType,
} from '@/prisma/generated/client'
import { Button } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import { capitalize } from '@src/lib/utils'
import type { Table } from '@tanstack/react-table'
import { DataTableFacetedFilter } from './FacetedFilter'

interface BasicFilterModelProps<TData> {
  table: Table<TData>
  filterModelType: 'TASK' | 'PROJECT' | undefined
  globalFilter: {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
  }
}

export function BasicFilterModel<TData>({
  table,
  filterModelType,
  globalFilter,
}: BasicFilterModelProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between m-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          placeholder="Filter Table.."
          type="text"
          autoComplete="off"
          value={globalFilter.value}
          onChange={(e) => globalFilter.setValue(e.target.value)}
        />
        {filterModelType && table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={Object.keys(
              filterModelType === 'PROJECT' ? StatusType : TaskStatusType,
            ).map((status) => {
              return {
                label: capitalize(status).toString().replace('_', ' '),
                value: status,
              }
            })}
          />
        )}
        {table?.getColumn('priority') ? (
          <DataTableFacetedFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={Object.keys(PriorityType).map((priority) => {
              return {
                label: capitalize(priority).toString().replace('_', ' '),
                value: priority,
              }
            })}
          />
        ) : null}
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
