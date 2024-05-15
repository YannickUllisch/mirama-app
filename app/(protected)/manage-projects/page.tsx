'use client'
import { Button } from '@/src/components/ui/button'
import {
  Archive,
  ArchiveRestore,
  ArrowUpDown,
  CalendarCheck2,
  CalendarDays,
  ChevronUp,
  Trash2,
} from 'lucide-react'
import { api, capitalize, fetcher, isTeamAdminOrOwner } from '@/src/lib/utils'
import {
  PriorityType,
  StatusType,
  type Project,
  type User,
} from '@prisma/client'
import useSWR from 'swr'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/src/components/Tables/DataTable'
import { CollapsibleTrigger } from '@/src/components/ui/collapsible'
import { useMemo, useState } from 'react'
import { StatusSelect } from '@/src/components/Select/StatusSelect'
import UserAvatar from '@/src/components/UserAvatar'
import { SelectItem } from '@/src/components/ui/tableSelect'
import CalendarSelect from '@/src/components/Select/CalendarSelect'
import { toast } from 'sonner'
import { Skeleton } from '@/src/components/ui/skeleton'
import TextInput from '@/src/components/Inputs/TextInput'
import NumberInput from '@/src/components/Inputs/NumberInput'
import { UserSelect } from '@/src/components/Select/UserSelect'
import { TableCell, TableFooter, TableRow } from '@/src/components/ui/table'
import { useSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import { PrioritySelect } from '@/src/components/Select/PrioritySelect'
import GeneralTooltip from '@/src/components/GeneralTooltip'
import GeneralAccordion from '@/src/components/GeneralAccordion'

interface CollapsedRows {
  [projectId: string]: boolean
}

const ProjectsPage = () => {
  // States
  const [collapsedRows, setCollapsedRows] = useState<CollapsedRows>({})

  const { data: session } = useSession()

  const toggleCollapse = (projectId: string) => {
    setCollapsedRows((prevState) => ({
      ...prevState,
      [projectId]: !prevState[projectId],
    }))
  }

  const { data: projects, mutate: updateProjects } = useSWR<
    (Project & {
      managedBy: User
    })[]
  >('/api/db/projekt', fetcher)

  const { data: users } = useSWR<User[]>('/api/db/user', fetcher)

  const filteredProjects = useMemo(() => {
    if (projects) {
      return projects.filter((project) => {
        return !project.archived
      })
    }
    return []
  }, [projects])

  const columns: ColumnDef<Project & { managedBy: User }>[] = [
    {
      accessorKey: 'id',
      header: 'Tasks',
      cell: (row) => {
        return (
          <CollapsibleTrigger
            key={`tasks${row.cell.id}`}
            className={`dark:text-white h-3.5 w-3.5 cursor-pointer transition-all ease-out transform ${
              collapsedRows[row.getValue() as string]
                ? 'rotate-180'
                : 'rotate-90'
            }`}
            asChild
            onClick={() => toggleCollapse(row.getValue() as string)}
          >
            <ChevronUp />
          </CollapsibleTrigger>
        )
      },
    },
    {
      accessorKey: 'name',
      id: 'nameRowAllProjects',
      header: 'Name',
      size: 500,
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <TextInput
              defaultValue={row.getValue() as string}
              id={row.row.original.id}
              mutate={updateProjects}
              key={`name${row.cell.id}`}
            />
          )
        }
        return row.getValue()
      },
    },
    {
      accessorKey: 'managedBy',
      header: 'Managed By',
      id: 'managedByRowAllProjects',
      cell: (row) => {
        const managedBy = row.cell.getValue() as User | undefined
        if (isTeamAdminOrOwner(session)) {
          return (
            <UserSelect
              id={row.row.original.id}
              mutate={updateProjects}
              placeholder={
                managedBy ? (
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      username={managedBy.name}
                      avatarSize={6}
                      fontSize={10}
                    />
                    {managedBy.name}
                  </div>
                ) : (
                  ''
                )
              }
            >
              {users?.map((user) => (
                <SelectItem value={user.id}>
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      avatarSize={6}
                      fontSize={10}
                      username={user.name}
                    />
                    {user.name}
                  </div>
                </SelectItem>
              ))}
            </UserSelect>
          )
        }
        return managedBy ? (
          <div className="flex items-center gap-1">
            <UserAvatar
              avatarSize={6}
              fontSize={10}
              username={managedBy.name}
            />
            {managedBy.name}
          </div>
        ) : (
          ''
        )
      },
    },
    {
      accessorKey: 'startDate',
      id: 'startRowAllProjects',
      header: ({ column }) => {
        return (
          <Button
            variant="default"
            className="bg-inherit hover:bg-inherit shadow-none text-neutral-500  dark:text-neutral-400 dark:hover:bg-inherit cursor-text"
          >
            Start Date
            <ArrowUpDown
              className="ml-2 h-4 w-4 cursor-pointer hover:text-neutral-700  dark:hover:text-neutral-200"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            />
          </Button>
        )
      },
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <CalendarSelect
              startingDate={row.getValue() as Date}
              project={row.row.original}
              dateType="start"
            />
          )
        }
        return (
          <div className="flex items-center cursor-default justify-center mr-8">
            {DateTime.fromISO(
              new Date(row.getValue() as Date).toISOString(),
            ).toFormat('dd.MM.yyyy')}
            <CalendarDays className="h-4 w-4 ml-1" />
          </div>
        )
      },
    },
    {
      accessorKey: 'endDate',
      id: 'endRowAllProjects',
      header: ({ column }) => {
        return (
          <Button
            variant="default"
            className="bg-inherit hover:bg-inherit shadow-none text-neutral-500  dark:text-neutral-400 dark:hover:bg-inherit cursor-text"
          >
            End Date
            <ArrowUpDown
              className="ml-2 h-4 w-4 cursor-pointer hover:text-neutral-700  dark:hover:text-neutral-200"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            />
          </Button>
        )
      },
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <CalendarSelect
              key={`endcalendar_${row.row.index}`}
              startingDate={row.getValue() as Date}
              project={row.row.original}
              dateType="end"
            />
          )
        }
        return (
          <div
            className="flex items-center cursor-default justify-center mr-8"
            key={`calendarEnd_${row.row.index}`}
          >
            {DateTime.fromISO(
              new Date(row.getValue() as Date).toISOString(),
            ).toFormat('dd.MM.yyyy')}
            <CalendarDays className="h-4 w-4 ml-1" />
          </div>
        )
      },
    },
    {
      header: 'Days Remaining',
      accessorKey: 'endDate',
      id: 'remainingAllProjects',
      cell: (row) => {
        const daysRemaining = -Math.floor(
          DateTime.utc().diff(
            DateTime.fromISO(row.getValue() as string),
            'days',
          ).days,
        )
        return (
          <div
            className={`flex justify-center ${
              daysRemaining <= 5
                ? 'text-red-500'
                : daysRemaining < 10 && daysRemaining > 5
                  ? 'text-yellow-500'
                  : 'text-emerald-500'
            }`}
          >
            {daysRemaining > 0 ? daysRemaining : 0}
          </div>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      id: 'priorityAllProjects',
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <PrioritySelect
              id={row.row.original.id}
              mutate={updateProjects}
              placeholder={capitalize(
                (row.getValue() as PriorityType).toString(),
              )}
            >
              <SelectItem value={PriorityType.LOW}>
                {capitalize(PriorityType.LOW.toString())}
              </SelectItem>
              <SelectItem value={PriorityType.MEDIUM}>
                {capitalize(PriorityType.MEDIUM.toString())}
              </SelectItem>
              <SelectItem value={PriorityType.HIGH}>
                {capitalize(PriorityType.HIGH.toString())}
              </SelectItem>
            </PrioritySelect>
          )
        }
        return capitalize(row.getValue() as string)
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'statusAllProjects',
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <StatusSelect
              id={row.row.original.id}
              mutate={updateProjects}
              placeholder={capitalize(
                (row.getValue() as StatusType).toString(),
              )}
            >
              <SelectItem value={StatusType.STARTING}>
                {capitalize(StatusType.STARTING.toString())}
              </SelectItem>
              <SelectItem value={StatusType.FINISHED}>
                {capitalize(StatusType.FINISHED.toString())}
              </SelectItem>
            </StatusSelect>
          )
        }
        return capitalize(row.getValue() as string)
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      id: 'budgetAllProjects',
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <NumberInput
              defaultValue={row.getValue() as number}
              id={row.row.original.id}
              mutate={updateProjects}
              key={`name${row.cell.id}`}
            />
          )
        }
        return row.getValue()
      },
    },
    {
      header: 'Actions',
      id: 'actionsAllProjects',
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <div className="flex items-center gap-1.5">
              <GeneralTooltip
                key={`delete_${row.row.index}`}
                tipText="Remove"
                trigger={
                  <Trash2
                    onClick={() => deleteRow(row.row.getValue('id'))}
                    className="w-3.5 h-3.5 text-rose-600 cursor-pointer"
                  />
                }
              />

              <GeneralTooltip
                key={`archive_${row.row.index}`}
                tipText={row.row.original.archived ? 'Unarchive' : 'Archive'}
                trigger={
                  row.row.original.archived ? (
                    <ArchiveRestore
                      onClick={() =>
                        archiveProject(
                          row.row.original.id,
                          !row.row.original.archived,
                        )
                      }
                      className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer "
                    />
                  ) : (
                    <Archive
                      onClick={() =>
                        archiveProject(
                          row.row.original.id,
                          !row.row.original.archived,
                        )
                      }
                      className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer "
                    />
                  )
                }
              />
              {row.row.original.archived ? undefined : (
                <GeneralTooltip
                  key={`gcalendar_${row.row.index}`}
                  tipText="Add to Google Calendar"
                  trigger={
                    <CalendarCheck2 className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer " />
                  }
                />
              )}
            </div>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <GeneralTooltip
              tipText="Add to Google Calendar"
              trigger={
                <CalendarCheck2
                  key={`gcalendar_${row.row.index}`}
                  className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer"
                />
              }
            />
          </div>
        )
      },
    },
  ]

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
        error: (err) => err.statusText ?? err,
        success: () => {
          updateProjects()

          return 'Project Successfully Created!'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  const archiveProject = (id: string, archived: boolean) => {
    try {
      toast.promise(api.put(`projekt?id=${id}`, { archived: archived }), {
        loading: 'Upadating Project..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          updateProjects()
          return 'Project Archived!'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <>
      <div className="flex flex-col mb-1">
        <span style={{ fontSize: 20 }} className="font-bold">
          Manage Projects
        </span>
      </div>
      <div className="flex justify-end mr-8">
        <Button variant="outline" onClick={createRow}>
          New Project
        </Button>
      </div>
      <div className="mt-5">
        {projects ? (
          <>
            <DataTable
              columns={columns}
              data={filteredProjects}
              pagination
              collapsible
              footer={
                <TableFooter>
                  <TableRow className="dark:bg-neutral-900 bg-neutral-50">
                    <TableCell
                      className="dark:text-white cursor-default"
                      colSpan={8}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      className="dark:text-white cursor-default"
                      colSpan={2}
                    >
                      Total:{' '}
                      {projects.reduce(
                        (acc, curr) => acc + (curr.budget || 0),
                        0,
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              }
            />
            <GeneralAccordion
              trigger="Archived"
              accordionContent={
                <DataTable
                  columns={columns}
                  data={projects.filter((project) => {
                    return project.archived
                  })}
                  collapsible
                />
              }
            />
          </>
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] flex rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 flex" />
              <Skeleton className="h-4 flex" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProjectsPage
