'use client'
import { Button } from '@/src/components/ui/button'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  Loader2,
  Trash2,
} from 'lucide-react'
import { api, fetcher } from '@/src/lib/utils'
import {
  PriorityType,
  StatusType,
  type Project,
  type User,
} from '@prisma/client'
import useSWR from 'swr'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/src/components/Tables/DataTable'
import { Input } from '@/src/components/Tables/tableInput'
import { CollapsibleTrigger } from '@/src/components/ui/collapsible'
import { useState } from 'react'
import { GeneralTableSelect } from '@/src/components/Select/GeneralTableSelect'
import UserAvatar from '@/src/components/UserAvatar'
import { SelectItem } from '@/src/components/ui/tableSelect'
import CalendarSelect from '@/src/components/Select/CalendarSelect'
import { toast } from 'sonner'

interface CollapsedRows {
  [projectId: string]: boolean
}

const ProjectsPage = () => {
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

  const columns: ColumnDef<Project & { managedBy: User }>[] = [
    {
      accessorKey: 'id',
      header: 'Tasks',
      cell: (row) => {
        return (
          <CollapsibleTrigger
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
          <Input
            className="flex w-24"
            placeholder={row.getValue() as string}
            defaultValue={row.getValue() as string}
            onChange={() => console.log(row.row.getValue('id'))}
            type="text"
          />
        )
      },
    },
    {
      accessorKey: 'managedBy',
      header: 'Managed By',
      cell: (row) => {
        const managedBy = row.cell.getValue() as User | undefined
        return (
          <GeneralTableSelect
            placeholder={
              managedBy ? <UserAvatar username={managedBy.name} /> : ''
            }
          >
            {users?.map((user) => (
              <SelectItem value={user.name ?? ''}>{user.name}</SelectItem>
            ))}
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Start Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (row) => {
        return (
          <CalendarSelect
            startingDate={row.getValue() as Date}
            project={row.row.original}
            dateType="start"
          />
        )
      },
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            End Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (row) => {
        return (
          <CalendarSelect
            startingDate={row.getValue() as Date}
            project={row.row.original}
            dateType="end"
          />
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: (row) => {
        return (
          <GeneralTableSelect placeholder={row.getValue() as PriorityType}>
            <SelectItem value={PriorityType.LOW}>{PriorityType.LOW}</SelectItem>
            <SelectItem value={PriorityType.MEDIUM}>
              {PriorityType.MEDIUM}
            </SelectItem>
            <SelectItem value={PriorityType.HIGH}>
              {PriorityType.HIGH}
            </SelectItem>
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row) => {
        return (
          <GeneralTableSelect placeholder={row.getValue() as StatusType}>
            <SelectItem value={StatusType.STARTING}>
              {StatusType.STARTING}
            </SelectItem>
            <SelectItem value={StatusType.FINISHED}>
              {StatusType.FINISHED}
            </SelectItem>
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: (row) => {
        return (
          <Input
            className="flex max-w-20"
            defaultValue={row.getValue() as number}
            onlyNumbers
          />
        )
      },
    },
    {
      header: 'Actions',
      cell: (row) => {
        return (
          <Button
            variant={'ghost'}
            className="flex items-center"
            onClick={() => deleteRow(row.row.getValue('id'))}
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
          </Button>
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
    <main className="flex items-center flex-col h-screen">
      <div className="w-full md:w-full lg:w-[1000px] ">
        <h2 className="p-3 dark:text-white flex items-center">
          <span>All Projects</span>
          {isProjectsLoading && (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          )}
        </h2>
        {projects ? <DataTable columns={columns} data={projects} /> : null}
        <Button
          variant="ghost"
          className="p-1 rounded-lg w-8 h-8"
          onClick={createRow}
        >
          <CirclePlus className=" transition-all text-emerald-700" />
        </Button>
      </div>
    </main>
  )
}

export default ProjectsPage
