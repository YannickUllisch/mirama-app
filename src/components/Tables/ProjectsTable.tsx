import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@src/components/ui/table'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible'

import { DateTime } from 'luxon'
import useSWR from 'swr'
import type { Project, Task, User } from '@prisma/client'
import { fetcher } from '@src/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import CollapsibleTasks from '@/src/components/Tables/CollapsibleTasks'
interface CollapsedRows {
  [projectId: string]: boolean
}

const ProjectsTable = () => {
  // States
  const [collapsedRows, setCollapsedRows] = useState<CollapsedRows>({})

  const toggleCollapse = (projectId: string) => {
    setCollapsedRows((prevState) => ({
      ...prevState,
      [projectId]: !prevState[projectId],
    }))
  }

  const { data: projects } = useSWR<
    (Project & {
      managedBy: User
      workItems: Task[]
    })[]
  >('/api/db/projekt', fetcher)

  return (
    <div className="w-full md:w-full lg:w-[1000px] ">
      <h2 className="p-4 dark:text-white">All Projects</h2>
      <div className="rounded-md sm:border overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium dark:text-white">
                Tasks
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                Name
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                Managed By
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                Start Date
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                End Date
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                Priority
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                Status
              </TableHead>
              <TableHead className="font-medium dark:text-white">
                Budget
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects
              ? projects.map((project) => (
                  <Collapsible key={project.id} asChild>
                    <>
                      <TableRow>
                        <TableCell>
                          <CollapsibleTrigger
                            className="dark:text-white h-3.5 w-3.5"
                            asChild
                            onClick={() => toggleCollapse(project.id)}
                          >
                            {collapsedRows[project.id] ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          {project.name}
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          {project?.managedBy?.name ?? ''}
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          {DateTime.fromISO(
                            project.startDate.toString(),
                          ).toFormat('dd.MM.yyyy')}
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          {DateTime.fromISO(
                            project.endDate.toString(),
                          ).toFormat('dd.MM.yyyy')}
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          {project.priority}
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          {project.status}
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          €{project.budget}
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <CollapsibleTasks projectId={project.id} />
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              : null}
          </TableBody>
          <TableFooter>
            <TableRow className="dark:bg-neutral-900">
              <TableCell className="dark:text-white" colSpan={7}>
                Total
              </TableCell>
              <TableCell className="dark:text-white">
                €
                {projects?.reduce((acc, project) => {
                  const budgetToAdd =
                    project.budget !== null ? project.budget : 0
                  return acc + budgetToAdd
                }, 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

export default ProjectsTable
