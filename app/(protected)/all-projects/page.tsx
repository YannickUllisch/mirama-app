'use client'
import { Button } from '@/src/components/ui/button'
import {
  ArrowUpDown,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CirclePlus,
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
import { useState } from 'react'
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
import { NextSeo } from 'next-seo'
import { DateTime } from 'luxon'
import { PrioritySelect } from '@/src/components/Select/PrioritySelect'
import TaskDialog from '@/src/components/Dialogs/TaskDialog'

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

  const columns: ColumnDef<Project & { managedBy: User }>[] = [
    {
      accessorKey: 'id',
      header: 'Tasks',
      cell: (row) => {
        return (
          <CollapsibleTrigger
            key={`tasks${row.cell.id}`}
            className="dark:text-white h-3.5 w-3.5 cursor-pointer transition-transform transform-gpu"
            asChild
            onClick={() => toggleCollapse(row.getValue() as string)}
          >
            {collapsedRows[row.getValue() as string] ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </CollapsibleTrigger>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (row) => {
        return (
          <TextInput
            defaultValue={row.getValue() as string}
            id={row.row.original.id}
            mutate={updateProjects}
            key={`name${row.cell.id}`}
          />
        )
      },
    },
    {
      accessorKey: 'managedBy',
      header: 'Managed By',

      cell: (row) => {
        const managedBy = row.cell.getValue() as User | undefined
        if (isTeamAdminOrOwner(session)) {
          return (
            <UserSelect
              id={row.row.original.id}
              mutate={updateProjects}
              placeholder={
                managedBy ? <UserAvatar username={managedBy.name} /> : ''
              }
            >
              {users?.map((user) => (
                <SelectItem value={user.id}>
                  <UserAvatar username={user.name} />
                </SelectItem>
              ))}
            </UserSelect>
          )
        }
        return managedBy ? <UserAvatar username={managedBy.name} /> : ''
      },
    },
    {
      accessorKey: 'startDate',
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
              startingDate={row.getValue() as Date}
              project={row.row.original}
              dateType="end"
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
      accessorKey: 'priority',
      header: 'Priority',
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
        return row.getValue()
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
        return row.getValue()
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
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
      cell: (row) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <Button
              key={`nameInput_${row.row.index}`}
              variant={'ghost'}
              className="flex items-center"
              onClick={() => deleteRow(row.row.getValue('id'))}
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
            </Button>
          )
        }
        return null
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

  return (
    <>
      <NextSeo
        title={'All Projects'}
        description={'Overview of all Projects'}
        noindex
      />
      <div className="flex flex-col mb-1">
        <span style={{ fontSize: 20 }} className="font-bold">
          All Projects
        </span>
        <div className="flex p-2 gap-2">
          <Button variant="outline" onClick={createRow}>
            Add Project
          </Button>
        </div>
      </div>
      <div className="p-5 bg-inherit rounded-xl">
        {projects ? (
          <DataTable
            columns={columns}
            data={projects}
            pagination
            footer={
              <TableFooter>
                <TableRow className="dark:bg-neutral-900">
                  <TableCell
                    className="dark:text-white cursor-default"
                    colSpan={7}
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
