'use client'
import type { Expense, Project } from '@prisma/client'
import GeneralSelect from '@src/components/Select/GeneralSelect'
import { DataTable } from '@src/components/Tables/DataTable'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { getExpenseColumns } from './columns'
import { BudgetExpenseBarChart } from '@src/components/Analytics/BudgetExpenseBarChart'
import { Separator } from '@src/components/ui/separator'
import { useSession } from 'next-auth/react'

const BudgetPage = () => {
  const { data: session } = useSession({ required: true })
  // States
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')

  const {
    data: projects,
    isLoading,
    mutate,
  } = useSWR<
    (Project & {
      expenses: Expense[]
    })[]
  >('project')

  const selectedProject = useMemo(() => {
    if (projects && selectedProjectId !== '') {
      return projects.find((project) => project.id === selectedProjectId)
    }
    return undefined
  }, [projects, selectedProjectId])

  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <span style={{ fontSize: 20 }}>Finances</span>
      </div>
      <BudgetExpenseBarChart projects={projects ?? []} />
      <Separator className="my-7" />
      <div>
        <span className="text-lg font-semibold">Project Specific Finances</span>
        <GeneralSelect
          setValue={setSelectedProjectId}
          value={selectedProjectId}
          placeholder="Select Project"
          items={
            projects?.map((project) => ({
              label: project.name,
              value: project.id,
            })) ?? []
          }
        />
        {selectedProject && (
          <>
            <DataTable
              key={`datatable-expenses-${selectedProject.name}`}
              tableIdentifier={`${selectedProject.name}-budget-table`}
              columns={getExpenseColumns({ mutate: mutate, session: session })}
              data={selectedProject.expenses ?? []}
              dataLoading={isLoading}
              toolbarOptions={{ showFilterOption: true }}
            />
          </>
        )}
      </div>
    </main>
  )
}

export default BudgetPage
