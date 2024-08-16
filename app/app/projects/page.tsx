'use client'
import { Button } from '@src/components/ui/button'
import {
  Archive,
  CalendarCheck2,
  CalendarDays,
  ChevronUp,
  Folder,
  Plus,
  Trash2,
} from 'lucide-react'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import {
  PriorityType,
  type ProjectUser,
  StatusType,
  type Project,
  type User,
} from '@prisma/client'
import useSWR from 'swr'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@src/components/Tables/DataTable'
import { SelectItem } from '@src/components/ui/tableSelect'
import CalendarSelect from '@src/components/Select/CalendarSelect'
import { TableCell, TableFooter, TableRow } from '@src/components/ui/table'
import { useSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import GeneralTooltip from '@src/components/GeneralTooltip'
import AddProjectDialog from '@src/components/Dialogs/AddProjectDialog'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import EditableCell from '@src/components/Inputs/EditableCell'
import GeneralTableSelect from '@src/components/Select/GeneralTableSelect'
import { updateResourceById } from '@src/lib/api/updateResource'
import { deleteResources } from '@src/lib/api/deleteResource'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import { useEffect, useMemo } from 'react'

const ProjectsPage = () => {
  // States
  const { data: session } = useSession()

  const {
    data: projects,
    mutate: updateProjects,
    isLoading: projectsLoading,
  } = useSWR<
    (Project & {
      users: ProjectUser[]
    })[]
  >('/api/db/projekt?archived=false')

  const { data: users, isLoading: usersLoading } = useSWR<User[]>(
    '/api/db/team/member',
  )

  const columns: ColumnDef<Project & { users: ProjectUser[] }>[] = [
    {
      accessorKey: 'id',
      enableHiding: false,
      enableSorting: false,
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
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
      accessorKey: 'users',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Managed By" />
      ),
      id: 'Managed By',
      cell: ({ row }) => {
        const managedBy = row.original.users.filter((user) => user.isManager)
        const managerNames =
          users
            ?.filter((user) =>
              managedBy.some((manager) => manager.userId === user.id),
            )
            .map((u) => u.name as string) ?? []

        return managerNames ? (
          <AvatarGroup
            usernames={managerNames ?? []}
            avatarSize={7}
            previewAmount={2}
            fontSize={10}
          />
        ) : (
          ''
        )
      },
    },
    {
      accessorKey: 'startDate',
      id: 'Start Date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" />
      ),
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Date" />
      ),
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <CalendarSelect
              key={`endcalendar_${row.row.index}`}
              startingDate={row.getValue() as Date}
              project={row.row.original}
              dateType="end"
              mutate={updateProjects}
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Days Remaining" />
      ),
      accessorKey: 'endDate',
      id: 'Days Remaining',
      size: 20,
      cell: ({ row }) => {
        const endDate = row.original.endDate.toString()
        const daysRemaining = useMemo(() => {
          return -Math.floor(
            DateTime.utc().diff(DateTime.fromISO(endDate as string), 'days')
              .days,
          )
        }, [endDate])

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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      id: 'Priority',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralTableSelect
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
            </GeneralTableSelect>
          )
        }
        return capitalize(getValue() as string)
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      id: 'Status',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralTableSelect
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
            </GeneralTableSelect>
          )
        }
        return capitalize(getValue() as string)
      },
    },
    {
      accessorKey: 'budget',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Budget" />
      ),
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
      id: 'Actions',
      header: 'Actions',
      enableResizing: false,
      cell: ({ row }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <div className="flex items-center gap-1.5">
              <GeneralTooltip key={`delete_${row.id}`} tipText="Remove">
                <ConfirmationDialog
                  dialogTitle={'Are you sure?'}
                  dialogDesc={'Deleting a project can not be undone!'}
                  submitButtonText={'Delete'}
                  dialogTrigger={
                    <Trash2 className="w-3.5 h-3.5 text-rose-600 cursor-pointer" />
                  }
                  onConfirmation={() =>
                    deleteResources('projekt', [row.original.id], {
                      mutate: updateProjects,
                    })
                  }
                />
              </GeneralTooltip>
              <GeneralTooltip
                key={`archive_${row.id}`}
                tipText={row.original.archived ? 'Unarchive' : 'Archive'}
              >
                <Archive
                  onClick={() =>
                    updateResourceById(
                      'projekt',
                      row.original.id,
                      {
                        archived: !row.original.archived,
                      },
                      { mutate: updateProjects },
                    )
                  }
                  className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer "
                />
              </GeneralTooltip>
              {row.original.archived ? undefined : (
                <GeneralTooltip
                  key={`gcalendar_${row.id}`}
                  tipText="Add to Google Calendar"
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer " />
                </GeneralTooltip>
              )}
            </div>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <GeneralTooltip tipText="Add to Google Calendar">
              <CalendarCheck2
                key={`gcalendar_${row.id}`}
                className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer"
              />
            </GeneralTooltip>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-2">
        <Folder width={20} />
        <span style={{ fontSize: 20 }}>All Projects</span>
      </div>
      <DataTable
        columns={columns}
        data={projects ?? []}
        dataLoading={projectsLoading || usersLoading}
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
    </>
  )
}

export default ProjectsPage
