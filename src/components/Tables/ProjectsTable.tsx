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
  Euro,
  Trash2,
  CirclePlus,
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
} from '@/src/components/ui/tableSelect'
import { Input } from '@/src/components/ui/tableInput'
import CalendarSelect from '../Select/CalendarSelect'
import UserAvatar from '../UserAvatar'
import { GeneralTableSelect } from '@src/components/Select/GeneralTableSelect'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '../ui/button'

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

  const {
    data: projects,
    isLoading: isProjectsLoading,
    mutate: updateProjects,
  } = useSWR<
    (Project & {
      managedBy: User
    })[]
  >('/api/db/projekt', fetcher)

  const { data: users } = useSWR<User[]>('/api/db/user', fetcher)

  const deleteRow = (id: string) => {
    try {
      toast.promise(api.delete(`projekt?id=${id}`), {
        loading: 'Deleting Project..',
        success: () => {
          updateProjects((prev) => prev?.filter((project) => project.id !== id))

          return 'Project Successfully Deleted!'
        },
        error: (err) => err.message ?? err,
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  const createRow = () => {
    try {
      toast.promise(api.post('projekt'), {
        loading: 'Creating Project..',
        error: (err) => err.message ?? err,
        success: () => {
          updateProjects()

          return 'Project Successfully Created!'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

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
                'Actions',
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
                      <TableRow key={project.id}>
                        <TableCell>
                          <CollapsibleTrigger
                            className="dark:text-white h-3.5 w-3.5 cursor-pointer transition-transform transform-gpu"
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
                          <Input
                            className="flex w-24"
                            placeholder={project.name}
                            defaultValue={project.name}
                            type="text"
                          />
                        </TableCell>
                        <TableCell className="dark:text-neutral-200 flex items-center w-20">
                          <GeneralTableSelect
                            placeholder={
                              project.managedBy ? (
                                <UserAvatar
                                  username={project?.managedBy?.name}
                                />
                              ) : (
                                ''
                              )
                            }
                          >
                            {users?.map((user) => (
                              <SelectItem value={user.name ?? ''}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </GeneralTableSelect>
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <CalendarSelect
                            startingDate={project.startDate}
                            project={project}
                            dateType="start"
                          />
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <CalendarSelect
                            startingDate={project.endDate}
                            project={project}
                            dateType="end"
                          />
                        </TableCell>
                        <TableCell className="dark:text-neutral-200">
                          <GeneralTableSelect placeholder={project.priority}>
                            <SelectItem value="finished">
                              {PriorityType.LOW}
                            </SelectItem>
                            <SelectItem value="starting">
                              {PriorityType.MEDIUM}
                            </SelectItem>
                            <SelectItem value="high">
                              {PriorityType.HIGH}
                            </SelectItem>
                          </GeneralTableSelect>
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
                        <TableCell className="dark:text-neutral-200">
                          <Button
                            variant={'ghost'}
                            className="flex items-center"
                            onClick={() => deleteRow(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
              <TableCell className="dark:text-white cursor-default" colSpan={2}>
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
      <Button
        variant="ghost"
        className="p-1 rounded-lg w-8 h-8"
        onClick={createRow}
      >
        <CirclePlus className=" transition-all text-emerald-700" />
      </Button>
    </div>
  )
}

export default ProjectsTable
