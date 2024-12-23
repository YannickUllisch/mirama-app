import {
  PriorityType,
  TaskStatusType,
  type Tag,
  type Task,
  type TaskCategory,
  type User,
} from '@prisma/client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import GeneralTableSelect from '@src/components/Select/GeneralTableSelect'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { Badge } from '@src/components/ui/badge'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { SelectItem } from '@src/components/ui/tableSelect'
import { deleteResources } from '@src/lib/api/deleteResource'
import {
  adjustBrightness,
  calculateBrightness,
  capitalize,
  getColorByTaskStatusType,
} from '@src/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import {
  BetweenHorizonalStart,
  CalendarClock,
  ChevronUp,
  ClockArrowDown,
  Ellipsis,
  FolderSearch,
  Loader,
  NotepadText,
  PanelBottomClose,
  Pencil,
  Tag as TagIcon,
  Trash,
  UserRoundPen,
} from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { KeyedMutator } from 'swr'

export const ListTabColumns = ({
  projectName,
  users,
  mutate,
}: {
  projectName: string
  users: User[]
  mutate: KeyedMutator<
    (Task & {
      assignedTo: User
      tags: Tag[]
      subtasks: Task[]
      category: TaskCategory | null
    })[]
  >
}) => {
  const cols: ColumnDef<
    Task & {
      assignedTo: User | null
      tags: Tag[]
      subtasks: Task
      category: TaskCategory | null
    }
  >[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableResizing: false,
      },

      {
        accessorKey: 'taskCode',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Code" />
        ),
        cell: ({ row, getValue }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            <div className="flex gap-2 items-center">
              {row.getCanExpand() ? (
                <ChevronUp
                  className={`dark:text-white h-3.5 w-3.5 cursor-pointer transition-all ease-out transform ${
                    row.getIsExpanded() ? 'rotate-180' : 'rotate-90'
                  }`}
                  onClick={row.getToggleExpandedHandler()}
                />
              ) : null}
              <Link
                onClick={(e) => e.stopPropagation()}
                href={`/app/${projectName}/edit/${row.original.id}`}
                className="hover:underline"
              >
                {getValue() as string}
              </Link>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Title"
            icon={<NotepadText className="dark:text-neutral-400" size={15} />}
          />
        ),
        id: 'title',
        size: 170,
        cell: ({ getValue, row }) => {
          const [menuOpen, setMenuOpen] = useState(false)
          return (
            <div className="flex justify-between group w-full">
              <div className="flex items-center gap-2">
                <span className="overflow-ellipsis flex-1 min-w-0">
                  {getValue() as string}
                </span>
              </div>

              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Ellipsis
                    className={`cursor-pointer flex-shrink-0 ${
                      !menuOpen && !row.getIsSelected()
                        ? 'invisible group-hover:visible'
                        : 'visible'
                    } bg-neutral-100 dark:bg-neutral-800 p-2 rounded-sm z-50 w-[25px] h-[25px]`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/app/${projectName}/edit/${row.original.id}`}
                      className="gap-3"
                    >
                      <Pencil className="h-4 w-4 " />
                      Edit Task
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/app/${projectName}/create/${row.original.projectId}?parentId=${row.original.id}`}
                      className="gap-3"
                    >
                      <BetweenHorizonalStart className="h-4 w-4 " />
                      Add Subtask
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-3"
                    onClick={() =>
                      deleteResources('task', [row.original.id], {
                        mutate: mutate,
                      })
                    }
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
      {
        accessorFn: (val) => val.category?.title ?? '',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Category"
            icon={<FolderSearch className="dark:text-neutral-400" size={15} />}
          />
        ),
        id: 'Category',
        cell: ({ getValue, row }) => {
          const color = row.original.category?.color
          if (!color) return null
          const brightness = calculateBrightness(color)

          const textColor =
            brightness > 200
              ? adjustBrightness(color, -200) // Darken text for bright backgrounds
              : adjustBrightness(color, 200) // Brighten text for dark backgrounds
          return (
            <Badge
              variant={'outline'}
              style={{ backgroundColor: color, color: textColor }}
            >
              {getValue() as string}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Priority"
            icon={
              <ClockArrowDown className="dark:text-neutral-400" size={15} />
            }
          />
        ),
        id: 'priority',
        cell: ({ row, getValue }) => {
          return (
            <GeneralTableSelect
              key={`priority-${row.id}`}
              id={row.original.id}
              mutate={mutate}
              initialValue={capitalize(
                (getValue() as string).replace('_', ' '),
              )}
              apiRoute="task"
              paramToUpdate="priority"
            >
              {Object.keys(PriorityType).map((priority) => (
                <SelectItem key={`priority-item-${priority}`} value={priority}>
                  {capitalize(priority.replace('_', ' '))}
                </SelectItem>
              ))}
            </GeneralTableSelect>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Status"
            icon={
              <PanelBottomClose className="dark:text-neutral-400" size={15} />
            }
          />
        ),
        id: 'status',
        cell: ({ getValue }) => {
          return (
            <Badge className={getColorByTaskStatusType(getValue() as string)}>
              {' '}
              {capitalize(getValue() as string)}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorFn: (val) => val.assignedTo?.name ?? '',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Assignee"
            icon={<UserRoundPen className="dark:text-neutral-400" size={15} />}
          />
        ),
        id: 'Assignee',
        cell: ({ row }) => {
          const assignedTo = row.original.assignedTo as User | undefined
          return (
            <GeneralTableSelect
              key={row.id}
              id={row.original.id}
              mutate={mutate}
              apiRoute="task"
              paramToUpdate="assignedToId"
              clearable
              initialValue={
                assignedTo ? (
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      username={assignedTo.name}
                      avatarSize={25}
                      fontSize={10}
                    />
                    {assignedTo.name}
                  </div>
                ) : (
                  ''
                )
              }
            >
              {/* We iterate over project.users to only allow members connected to the current project */}
              {users
                ? users.map((user) => (
                    <SelectItem value={user.id} key={`user-item-${user.id}`}>
                      <div className="flex items-center gap-1">
                        <UserAvatar
                          avatarSize={25}
                          fontSize={10}
                          username={user.name}
                        />
                        {user.name}
                      </div>
                    </SelectItem>
                  ))
                : null}
            </GeneralTableSelect>
          )
        },
      },
      {
        accessorKey: 'dueDate',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Estimation"
            icon={<CalendarClock className="dark:text-neutral-400" size={15} />}
          />
        ),
        id: 'Estimation',
        cell: ({ row }) => {
          return (
            <div
              className="flex items-center cursor-default justify-left mr-8 gap-1"
              key={`calendar-end-${row.index}`}
            >
              {`${DateTime.fromISO(
                new Date(row.original.startDate as Date).toISOString(),
              ).toFormat('MMM dd, yyyy')} - ${DateTime.fromISO(
                new Date(row.original.dueDate as Date).toISOString(),
              ).toFormat('MMM dd, yyyy')}`}
            </div>
          )
        },
        filterFn: 'equalsString',
        size: 200,
      },
      {
        accessorKey: 'tags',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Tags"
            icon={<TagIcon className="dark:text-neutral-400" size={15} />}
          />
        ),
        id: 'tags',
        size: 50,
        cell: ({ row, getValue }) => {
          return (
            <div
              className="flex items-center cursor-default justify-left mr-8 gap-1"
              key={`tag-${row.index}`}
            >
              {(getValue() as Tag[]).map((tag) => (
                <span
                  key={`status-item-${tag.title}`}
                  className="bg-destructive text-white p-1 rounded-lg"
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )
        },
      },
    ],
    [users, projectName, mutate],
  )
  return cols
}
