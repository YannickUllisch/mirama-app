'use client'
import type { Expense, Project } from '@prisma/client'
import GeneralAccordion from '@src/components/GeneralAccordion'
import { Calculator } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

const BudgetPage = () => {
  const { data: projects } =
    useSWR<
      (Project & {
        expenses: Expense[]
      })[]
    >('/api/db/projekt')
  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Calculator width={20} />
        <span style={{ fontSize: 20 }}>Budgets</span>
      </div>

      {projects?.map((project) => (
        <GeneralAccordion trigger={project.name} defaultOpen={false}>
          {project.budget}
        </GeneralAccordion>
      ))}
    </main>
  )
}

export default BudgetPage
