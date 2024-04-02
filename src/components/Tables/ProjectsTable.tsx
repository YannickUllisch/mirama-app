'use client'
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
import {
  StatusType,
  type Project,
  type User,
  PriorityType,
} from '@prisma/client'
import { api, fetcher } from '@src/lib/utils'
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  CalendarDays,
  Euro,
} from 'lucide-react'
import { useState } from 'react'
import CollapsibleTasks from '@/src/components/Tables/CollapsibleTasks'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@src/components/Tables/tableSelect'
import { Input } from '@src/components/Tables/tableInput'
import CalendarSelect from './CalendarSelect'
import UserAvatar from '../UserAvatar'

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

  const { data: projects, isLoading: isProjectsLoading } = useSWR<
    (Project & {
      managedBy: User
    })[]
  >('/api/db/projekt', fetcher)

  const { data: users } = useSWR<User[]>('/api/db/user', fetcher)

  return (
    <div className="w-full md:w-full lg:w-[1000px] ">
      <h2 className="p-3 dark:text-white flex items-center">
        <span>All Projects</span>
        {isProjectsLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
      </h2>
      <div className="rounded-md sm:border overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              {[
                'Tasks',
                'Name',
                'Managed By',
                'Start Date',
                'End Date',
                'Priority',
                'Status',
                'Budget',
              ].map((title) => (
                <TableHead key={title} className="font-medium dark:text-white">
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody style={{ height: '50px' }}>
            {projects
              ? projects.map((project) => (
                  <Collapsible key={project.id} asChild>
                    <>
                      <TableRow>
                        <TableCell>
                          <CollapsibleTrigger
                            className="dark:text-white h-3.5 w-3.5 cursor-pointer transition-transform transform-gpu"
                            asChild
                            onClick={() => toggleCollapse(project.id)}
                          >
                            {collapsedRows[project.id] ? (
                              <ChevronUp className="rotate-180" />
                            ) : (
                              <ChevronDown />
                            )}
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <Input
                            className="flex max-w-20"
                            placeholder={project.name}
                            defaultValue={project.name}
                            type="text"
                          />
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <Select>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  project.managedBy ? (
                                    <UserAvatar
                                      username={project?.managedBy?.name}
                                    />
                                  ) : (
                                    ''
                                  )
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {users?.map((user) => (
                                  <SelectItem value={user.name ?? ''}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <div className="flex items-center cursor-default">
                            {DateTime.fromISO(
                              project.startDate.toString(),
                            ).toFormat('dd.MM.yyyy')}
                            <CalendarDays className="h-4 w-4 ml-1 cursor-pointer" />
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <div className="flex items-center cursor-default">
                            {DateTime.fromISO(
                              project.endDate.toString(),
                            ).toFormat('dd.MM.yyyy')}
                            <CalendarDays
                              className="h-4 w-4 ml-1  cursor-pointer"
                              onClick={() => console.log('yo')}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={project.priority} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="finished">
                                  {PriorityType.LOW}
                                </SelectItem>
                                <SelectItem value="starting">
                                  {PriorityType.MEDIUM}
                                </SelectItem>
                                <SelectItem value="high">
                                  {PriorityType.HIGH}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={project.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value={StatusType.FINISHED}>
                                  {StatusType.FINISHED}
                                </SelectItem>
                                <SelectItem value={StatusType.STARTING}>
                                  {StatusType.STARTING}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <div className="flex items-center">
                            <Euro className="h-3 w-3" />
                            <Input
                              className="flex max-w-20"
                              defaultValue={project.budget?.toString()}
                              onlyNumbers
                            />
                          </div>
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
              <TableCell className="dark:text-white cursor-default" colSpan={7}>
                Total
              </TableCell>
              <TableCell className="dark:text-white cursor-default">
                {projects
                  ? `€${projects?.reduce((acc, project) => {
                      const budgetToAdd =
                        project.budget !== null ? project.budget : 0
                      return acc + budgetToAdd
                    }, 0)}`
                  : ''}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

export default ProjectsTable
