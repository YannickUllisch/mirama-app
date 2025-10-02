import {
  PriorityType,
  type Tag,
  type Task,
  TaskStatusType,
  type TaskTagJoin,
  type User,
} from '@prisma/client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import GeneralTooltip from '@src/components/GeneralTooltip'
import EditableCell from '@src/components/Inputs/EditableCell'
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@src/components/ui/hover-card'
import { SelectItem } from '@src/components/ui/tableSelect'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { capitalize, getColorByTaskStatusType } from '@src/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import Centering from '@ui/centering'
import {
  BetweenHorizonalStart,
  CalendarClock,
  ChevronUp,
  ClockArrowDown,
  Ellipsis,
  PanelBottomClose,
  Pencil,
  PencilLine,
  Tag as TagIcon,
  Text,
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
  onTaskDelete,
}: {
  projectName: string
  users: User[]
  onTaskDelete: (id: string) => void
  mutate: KeyedMutator<
    (Task & {
      assignedTo: User
      tags: (TaskTagJoin & { tag: Tag })[]
      subtasks: Task[]
    })[]
  >
}) => {
  const cols: ColumnDef<
    Task & {
      assignedTo: User | null
      tags: Tag[]
      subtasks: Task
    }
  >[] = useMemo(
    () => [
      {
        size: 50,
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
              {getValue() as string}
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
            icon={<Text className="dark:text-neutral-400" size={15} />}
          />
        ),
        id: 'title',
        cell: ({ getValue, row }) => {
          const [menuOpen, setMenuOpen] = useState(false)
          const [isEditing, setIsEditing] = useState(false)
          return (
            <div className="flex justify-between group w-full">
              <Centering>
                <span className="overflow-ellipsis flex-1 min-w-0">
                  {isEditing ? (
                    <Centering>
                      {getTaskTypeIcon(row.original.type)}
                      <EditableCell
                        key={`name${row.id}`}
                        apiRoute="task"
                        id={row.original.id}
                        mutate={mutate}
                        initialValue={getValue() as string}
                        paramToUpdate="title"
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
                    </Centering>
                  ) : (
                    <Centering>
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/app/projects/${projectName}/edit/${row.original.id}`}
                        className="hover:underline flex gap-2 items-center underline-offset-4"
                      >
                        {getTaskTypeIcon(row.original.type)}
                        {getValue() as string}
                      </Link>
                      <GeneralTooltip tipText="Start Edit">
                        <PencilLine
                          aria-label="Start Title Edit"
                          onClick={() => setIsEditing(true)}
                          className="w-[12px] h-[12px] opacity-0 group-hover:opacity-100"
                        />
                      </GeneralTooltip>
                    </Centering>
                  )}
                </span>
              </Centering>

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
                      href={`/app/projects/${projectName}/edit/${row.original.id}`}
                      className="gap-3"
                    >
                      <Pencil className="h-4 w-4 " />
                      Edit Task
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/app/projects/${projectName}/create/${row.original.type}?parentId=${row.original.id}`}
                      className="gap-3"
                    >
                      <BetweenHorizonalStart className="h-4 w-4 " />
                      Add Subtask
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-3"
                    onClick={() => onTaskDelete(row.original.id)}
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
              stylingProps={{ triggerStyle: 'w-fit h-fit p-1' }}
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
        cell: ({ getValue, row }) => {
          return (
            <GeneralTableSelect
              key={`status-${row.id}`}
              id={row.original.id}
              mutate={mutate}
              initialValue={
                <div className="flex gap-2 items-center">
                  <div
                    className={`rounded-full h-2 w-2 ${getColorByTaskStatusType(
                      getValue() as string,
                    )}`}
                  />
                  {capitalize(getValue() as string)}
                </div>
              }
              apiRoute="task"
              paramToUpdate="status"
              stylingProps={{ triggerStyle: 'w-fit h-fit p-1' }}
            >
              {Object.keys(TaskStatusType).map((status) => (
                <SelectItem key={`status-item-${status}`} value={status}>
                  <div className="flex gap-2 items-center">
                    <div
                      className={`rounded-full h-2 w-2 ${getColorByTaskStatusType(
                        status,
                      )}`}
                    />
                    {capitalize(status)}
                  </div>
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
              stylingProps={{
                triggerStyle: !assignedTo ? '' : 'w-fit h-fit p-1',
              }}
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
      },
      {
        accessorKey: 'tags',
        id: 'tags',
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Tags"
            icon={<TagIcon className="dark:text-neutral-400" size={15} />}
          />
        ),
        cell: ({ row, getValue }) => {
          const tasks = getValue() as (TaskTagJoin & { tag: Tag })[]
          const taskCount = tasks.length

          // If there are more than 2 tasks, we will show the "X tasks left" badge
          const remainingTasks = taskCount > 2 ? tasks.slice(2) : []

          return (
            <div
              className="flex items-center cursor-default justify-left flex-wrap gap-1"
              key={`tag-${row.index}`}
            >
              {/* Render up to 2 task badges */}
              {tasks.slice(0, 2).map((tag) => (
                <Badge
                  variant="outline"
                  className="flex-nowrap whitespace-nowrap text-ellipsis"
                  key={`status-item-${tag.tag.title}`}
                >
                  {tag.tag.title}
                </Badge>
              ))}

              {/* Render the "X tasks left" badge if there are more than 2 tasks */}
              {remainingTasks.length > 0 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Badge
                      variant="outline"
                      className="flex-nowrap whitespace-nowrap text-ellipsis"
                    >
                      .. {remainingTasks.length}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    {/* Display the remaining tasks in the HoverCard */}
                    {remainingTasks.map((task) => (
                      <div
                        key={`remaining-task-${task.id}`}
                        className="text-xs"
                      >
                        {task.tag.title}
                      </div>
                    ))}
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          )
        },
      },
    ],
    [users, projectName, mutate, onTaskDelete],
  )
  return cols
}
