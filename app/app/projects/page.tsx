'use client'
import { Button } from '@src/components/ui/button'
import {
  Archive,
  Calendar,
  CalendarCheck2,
  CalendarDays,
  ChevronUp,
  Ellipsis,
  Folder,
  Pencil,
  PencilLine,
  Plus,
  Trash,
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
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { DataTable } from '@src/components/Tables/DataTable'
import { SelectItem } from '@src/components/ui/tableSelect'
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
import { useMemo, useState } from 'react'
import CalendarTableSelect from '@src/components/Select/CalendarTableSelect'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { GoogleBinaryIcon, GoogleColoredIcon } from '@src/lib/ui/CompanyIcons'

const ProjectsPage = () => {
  // States
  const { data: session } = useSession()
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: 'Name', desc: true },
  ])

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
      id: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      size: 150,
      cell: ({ row, getValue }) => {
        const [isEditing, setIsEditing] = useState(false)

        if (isEditing && isTeamAdminOrOwner(session)) {
          return (
            <div className="flex gap-2 items-center">
              <EditableCell
                key={`name${row.id}`}
                apiRoute="projekt"
                id={row.original.id}
                mutate={updateProjects}
                initialValue={getValue() as string}
                paramToUpdate="name"
                autofocus
                onBlueNoChange={() => setIsEditing(false)}
              />
              <GeneralTooltip tipText="Stop Edit">
                <Pencil
                  aria-label="Stop Title Edit"
                  onClick={() => setIsEditing(false)}
                  className="w-[12px] h-[12px]"
                />
              </GeneralTooltip>
            </div>
          )
        }

        if (isTeamAdminOrOwner(session)) {
          return (
            <div className="flex gap-2 items-center">
              <Link
                href={`/app/${row.original.name}`}
                className="hover:underline"
              >
                {getValue() as string}
              </Link>
              <GeneralTooltip tipText="Start Edit">
                <PencilLine
                  aria-label="Start Title Edit"
                  onClick={() => setIsEditing(true)}
                  className="w-[12px] h-[12px]"
                />
              </GeneralTooltip>
            </div>
          )
        }
        return (
          <Link href={`/app/${row.original.name}`} className="hover:underline">
            {getValue() as string}
          </Link>
        )
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

        if (isTeamAdminOrOwner(session)) {
          return (
            managerNames && (
              <AvatarGroup
                usernames={managerNames ?? []}
                avatarSize={7}
                previewAmount={2}
                fontSize={10}
              />
            )
          )
        }
        return (
          managerNames && (
            <AvatarGroup
              usernames={managerNames ?? []}
              avatarSize={7}
              previewAmount={2}
              fontSize={10}
            />
          )
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
            <CalendarTableSelect
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
            <CalendarTableSelect
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
      id: 'priority',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralTableSelect
              key={`priority${row.id}`}
              apiRoute="projekt"
              paramToUpdate="priority"
              id={row.original.id}
              mutate={updateProjects}
              initialValue={capitalize(
                (getValue() as string).replace('_', ' '),
              )}
            >
              {Object.keys(PriorityType).map((type) => (
                <SelectItem key={`priority-item-${type}`} value={type}>
                  {capitalize(type.replace('_', ' '))}
                </SelectItem>
              ))}
            </GeneralTableSelect>
          )
        }
        return capitalize((getValue() as string).replace('_', ' '))
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      id: 'status',
      cell: ({ row, getValue }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <GeneralTableSelect
              key={`status${row.id}`}
              id={row.original.id}
              mutate={updateProjects}
              initialValue={capitalize(
                (getValue() as string).replace('_', ' '),
              )}
              apiRoute="projekt"
              paramToUpdate="status"
            >
              {Object.keys(StatusType).map((type) => (
                <SelectItem key={`status-item-${type}`} value={type}>
                  {capitalize(type.replace('_', ' '))}
                </SelectItem>
              ))}
            </GeneralTableSelect>
          )
        }
        return capitalize((getValue() as string).replace('_', ' '))
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
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
        const [menuOpen, setMenuOpen] = useState(false)
        if (isTeamAdminOrOwner(session)) {
          return (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <>
                  {isTeamAdminOrOwner(session) && (
                    <>
                      <DropdownMenuItem
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
                        className="gap-3"
                      >
                        <Archive className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer " />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3">
                        <ConfirmationDialog
                          dialogTitle={'Are you sure?'}
                          dialogDesc={'Deleting a project can not be undone!'}
                          submitButtonText={'Delete'}
                          onConfirmation={() =>
                            deleteResources('projekt', [row.original.id], {
                              mutate: updateProjects,
                            })
                          }
                        >
                          <>
                            <Trash className="h-4 w-4 text-red-500" />
                            Delete
                          </>
                        </ConfirmationDialog>
                      </DropdownMenuItem>
                    </>
                  )}
                </>
                <DropdownMenuItem
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
                  className="gap-3"
                >
                  <GoogleColoredIcon color="#fff" height="18" width="18" />
                  Add to Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        sortingState={sortingState}
        setSortingState={setSortingState}
        toolbarOptions={{
          showViewOptionsicon: true,
          showFilterOption: true,
          filterOptionType: 'PROJECT',
          addToolbarleft: isTeamAdminOrOwner(session) && (
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
          ),
          refresh: { mutate: updateProjects },
        }}
        footerOptions={{
          addFooterRow: (
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
                  {projects?.reduce(
                    (acc, curr) => acc + (curr.budget || 0),
                    0,
                  ) ?? 0}
                </TableCell>
              </TableRow>
            </TableFooter>
          ),
          showPagination: true,
        }}
      />
    </>
  )
}

export default ProjectsPage
