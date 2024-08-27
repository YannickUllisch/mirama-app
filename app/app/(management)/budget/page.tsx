'use client'
import type { Expense, Project } from '@prisma/client'
import GeneralAccordion from '@src/components/GeneralAccordion'
import EditableCell from '@src/components/Inputs/EditableCell'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { Calculator } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

const BudgetPage = () => {
  const { data: projects, isLoading } =
    useSWR<
      (Project & {
        expenses: Expense[]
      })[]
    >('/api/db/projekt')

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'id',
      enableHiding: false,
      enableSorting: false,
      header: '',
      cell: '',
    },
    {
      accessorKey: 'title',
      id: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      size: 150,
    },
    {
      accessorKey: 'description',
      id: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      size: 150,
    },
    {
      accessorKey: 'amount',
      id: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      size: 150,
    },
  ]
  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Calculator width={20} />
        <span style={{ fontSize: 20 }}>Budgets</span>
      </div>

      {projects?.map((project) => (
        <GeneralAccordion
          trigger={
            <div className="gap-4 flex">
              <span>{project.name}</span>
              {project.expenses.length}
            </div>
          }
          defaultOpen={false}
        >
          <DataTable
            columns={columns}
            data={project.expenses ?? []}
            dataLoading={isLoading}
          />
        </GeneralAccordion>
      ))}
    </main>
  )
}

export default BudgetPage
