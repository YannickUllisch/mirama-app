'use client'
import { Button } from '@/src/components/ui/button'
import {
  Archive,
  ArchiveRestore,
  ArrowUpDown,
  CalendarCheck2,
  CalendarDays,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react'
import { api, capitalize, isTeamAdminOrOwner } from '@/src/lib/utils'
import {
  PriorityType,
  StatusType,
  type Project,
  type User,
} from '@prisma/client'
import useSWR from 'swr'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/src/components/Tables/DataTable'
import { useMemo } from 'react'
import UserAvatar from '@/src/components/Header/UserAvatar'
import { SelectItem } from '@/src/components/ui/tableSelect'
import CalendarSelect from '@/src/components/Select/CalendarSelect'
import { toast } from 'sonner'
import { TableCell, TableFooter, TableRow } from '@/src/components/ui/table'
import { useSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import GeneralTooltip from '@/src/components/GeneralTooltip'
import GeneralAccordion from '@/src/components/GeneralAccordion'
import AddProjectDialog from '@/src/components/Dialogs/AddProjectDialog'
import ConfirmationDialog from '@/src/components/Dialogs/ConfirmationDialog'
import EditableCell from '@/src/components/Inputs/EditableCell'
import GeneralSelect from '@/src/components/Select/GeneralSelect'

const ProjectsPage = () => {
  // States
  const { data: session } = useSession()

  const { data: projects, mutate: updateProjects } =
    useSWR<
      (Project & {
        managedBy: User
      })[]
    >('/api/db/projekt')

  const { data: users } = useSWR<User[]>('/api/db/user')

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
      header: '',
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <ChevronUp
            className={`dark:text-white h-3.5 w-3.5 cursor-pointer transition-all ease-out transform ${
              row.getIsExpanded() ? 'rotate-180' : 'rotate-90'
            }`}
            onClick={row.getToggleExpandedHandler()}
          />
        ) : null
      },
    },
    {
      accessorKey: 'name',
      id: 'Name',
      header: 'Name',
      size: 150,
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <EditableCell
              key={`name${row.id}`}
              apiRoute="projekt"
              id={row.original.id}
              mutate={updateProjects}
              initialValue={getValue() as string}
              paramToUpdate="name"
            />
          )
        }
        return getValue()
      },
    },
    {
      accessorKey: 'managedBy',
      header: 'Managed By',
      id: 'Managed By',
      cell: ({ row }) => {
        const managedBy = row.original.managedBy as User | undefined
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralSelect
              key={`managedbY${row.id}`}
              id={row.original.id}
              mutate={updateProjects}
              apiRoute="projekt"
              paramToUpdate="managedById"
              initialValue={
                managedBy ? (
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      key={managedBy.name}
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
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      key={user.name}
                      avatarSize={6}
                      fontSize={10}
                      username={user.name}
                    />
                    {user.name}
                  </div>
                </SelectItem>
              ))}
            </GeneralSelect>
          )
        }
        return managedBy ? (
          <div className="flex items-center gap-1">
            <UserAvatar
              key={managedBy.name}
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
      id: 'Start Date',
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
      id: 'End Date',
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
      id: 'Days Remaining',
      size: 20,
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
      id: 'Priority',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralSelect
              key={`priority${row.id}`}
              apiRoute="projekt"
              paramToUpdate="priority"
              id={row.original.id}
              mutate={updateProjects}
              initialValue={capitalize((getValue() as PriorityType).toString())}
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
            </GeneralSelect>
          )
        }
        return capitalize(getValue() as string)
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'Status',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralSelect
              key={`status${row.id}`}
              id={row.original.id}
              mutate={updateProjects}
              initialValue={capitalize((getValue() as StatusType).toString())}
              apiRoute="projekt"
              paramToUpdate="status"
            >
              <SelectItem value={StatusType.NOTSTARTED}>Not Started</SelectItem>
              <SelectItem value={StatusType.ONHOLD}>On Hold</SelectItem>
              <SelectItem value={StatusType.ONGOING}>Ongoing</SelectItem>
              <SelectItem value={StatusType.FINISHED}>Finished</SelectItem>
            </GeneralSelect>
          )
        }
        return capitalize(getValue() as string)
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      size: 100,
      id: 'Budget',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <EditableCell
              key={`name${row.id}`}
              initialValue={getValue() as number}
              id={row.original.id}
              mutate={updateProjects}
              apiRoute="projekt"
              paramToUpdate="budget"
            />
          )
        }
        return getValue()
      },
    },
    {
      header: 'Actions',
      id: 'Actions',
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <div className="flex items-center gap-1.5">
              <GeneralTooltip
                key={`delete_${row.row.index}`}
                tipText="Remove"
                trigger={
                  <ConfirmationDialog
                    dialogTitle={'Are you sure?'}
                    dialogDesc={'Deleting a project can not be undone!'}
                    submitButtonText={'Delete'}
                    dialogTrigger={
                      <Trash2 className="w-3.5 h-3.5 text-rose-600 cursor-pointer" />
                    }
                    onConfirmation={() => deleteProject(row.row.original.id)}
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

  const deleteProject = (id?: string) => {
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
      <DataTable
        columns={columns}
        data={filteredProjects}
        pagination
        columnvisibility
        tableHeader={
          <AddProjectDialog
            key={'Project Dialog'}
            mutate={updateProjects}
            button={
              <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Plus width={15} className="ml-2" />
                <Button
                  style={{ fontSize: 11, textDecoration: 'none' }}
                  variant="link"
                >
                  New Project
                </Button>
              </div>
            }
          />
        }
        footer={
          <TableFooter>
            <TableRow className="dark:bg-neutral-900 bg-neutral-50">
              <TableCell className="dark:text-white cursor-default" colSpan={8}>
                Total
              </TableCell>
              <TableCell className="dark:text-white cursor-default" colSpan={2}>
                Total:{' '}
                {projects?.reduce((acc, curr) => acc + (curr.budget || 0), 0) ??
                  0}
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
            data={
              projects?.filter((project) => {
                return project.archived
              }) ?? []
            }
          />
        }
      />
    </>
  )
}

export default ProjectsPage
