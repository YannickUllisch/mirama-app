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
import { CollapsibleTrigger } from '@/src/components/ui/collapsible'
import { useState } from 'react'
import { GeneralTableSelect } from '@/src/components/Select/GeneralTableSelect'
import UserAvatar from '@/src/components/UserAvatar'
import { SelectItem } from '@/src/components/ui/tableSelect'
import CalendarSelect from '@/src/components/Select/CalendarSelect'
import { toast } from 'sonner'
import { Skeleton } from '@/src/components/ui/skeleton'
import DataInput from '@/src/components/Inputs/TextInput'
import TextInput from '@/src/components/Inputs/TextInput'

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
        return (
          <GeneralTableSelect
            placeholder={
              managedBy ? <UserAvatar username={managedBy.name} /> : ''
            }
          >
            {users?.map((user) => (
              <SelectItem value={user.name ?? ''}>
                <UserAvatar username={user.name} />
              </SelectItem>
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
        const type = row.getValue() as PriorityType
        return (
          <GeneralTableSelect placeholder={type}>
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
          <DataInput
            defaultValue={row.getValue() as string}
            id={row.row.original.id}
            mutate={updateProjects}
            key={`name${row.cell.id}`}
          />
        )
      },
    },
    {
      header: 'Actions',
      cell: (row) => {
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
        <div className="flex p-1">
          <Button
            variant="ghost"
            className="p-1 rounded-lg w-10 h-10"
            onClick={createRow}
          >
            <CirclePlus className=" transition-all text-green-600" />
          </Button>
          <h2 className="p-2 dark:text-white flex">
            <span>All Projects</span>
            {isProjectsLoading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            )}
          </h2>
        </div>
        {projects ? (
          <DataTable columns={columns} data={projects} />
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[900px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[900px]" />
              <Skeleton className="h-4 w-[850px]" />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default ProjectsPage
