'use client'
import {
  type Project,
  type ProjectUser,
  StatusType,
  type User,
} from '@prisma/client'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import GeneralTooltip from '@src/components/GeneralTooltip'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import GeneralTableSelect from '@src/components/Select/GeneralTableSelect'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { SelectItem } from '@src/components/ui/tableSelect'
import { deleteResources } from '@src/lib/api/deleteResource'
import { updateResourceById } from '@src/lib/api/updateResource'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Archive,
  ArchiveRestore,
  CalendarDays,
  ChevronUp,
  Trash2,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'

const ArchivePage = () => {
  const { data: session } = useSession()
  const {
    data: projects,
    mutate: updateProjects,
    isLoading: projectsLoading,
  } = useSWR<
    (Project & {
      users: (ProjectUser & { user: User })[]
    })[]
  >('/api/db/projekt?archived=true')

  const columns: ColumnDef<
    Project & { users: (ProjectUser & { user: User })[] }
  >[] = [
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
    },
    {
      accessorKey: 'users',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Managed By" />
      ),
      id: 'Managed By',
      cell: ({ row }) => {
        const managedBy = row.original.users.filter((user) => user.isManager)
        const managerNames = managedBy.map((manager) => manager.user.name ?? '')

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
        return (
          <div className="flex items-center cursor-default justify-start gap-1">
            {DateTime.fromISO(
              new Date(row.getValue() as Date).toISOString(),
            ).toFormat('dd.MM.yyyy')}
            <CalendarDays className="h-4 w-4" />
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
        return (
          <div
            className="flex items-center cursor-default justify-start gap-1"
            key={`calendarEnd_${row.row.index}`}
          >
            {DateTime.fromISO(
              new Date(row.getValue() as Date).toISOString(),
            ).toFormat('dd.MM.yyyy')}
            <CalendarDays className="h-4 w-4" />
          </div>
        )
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
                  dialogDesc={
                    'Deleting a project is final and cannot be undone.'
                  }
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
              <GeneralTooltip key={`unarchive${row.id}`} tipText={'Unarchive'}>
                <ArchiveRestore
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
            </div>
          )
        }
      },
    },
  ]

  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-5">
        <Archive width={20} />
        <span style={{ fontSize: 20 }}>Project Archive</span>
      </div>
      <DataTable
        pagination
        columnvisibility
        expandedContent
        columns={columns}
        data={projects ?? []}
        dataLoading={projectsLoading}
      />
    </>
  )
}

export default ArchivePage
