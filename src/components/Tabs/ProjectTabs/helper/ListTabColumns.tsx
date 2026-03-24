import type { HandleFieldUpdate } from '@hooks/utils/useEditableColumns'
import { PriorityType, TaskStatusType } from '@prisma/client'
import type { UserResponseType } from '@server/domain/memberSchema'
import type { TagResponseType } from '@server/domain/tagSchema'
import type { TaskResponseType } from '@server/domain/taskSchema'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import HoverLink from '@src/components/HoverLink'
import {
  EditableCell,
  EditableCellType,
} from '@src/components/Tables/Cell/EditableCell'
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
import { capitalize, getColorByTaskStatusType } from '@src/lib/utils'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { Button } from '@ui/button'
import {
  BetweenHorizonalStart,
  ChevronUp,
  Ellipsis,
  Pencil,
  Tag as TagIcon,
  Trash,
} from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useMemo } from 'react'

const columnHelper = createColumnHelper<TaskResponseType>()

export const useTaskColumns = ({
  users,
  handleFieldUpdate,
  deleteMutation,
}: {
  users: UserResponseType[]
  handleFieldUpdate: HandleFieldUpdate<TaskResponseType>
  deleteMutation: UseMutateFunction<
    any,
    Error,
    {
      id: string
      pid: string
    },
    any
  >
}) =>
  useMemo(
    () => [
      columnHelper.display({
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
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
      }),

      columnHelper.accessor((row) => row.taskCode, {
        id: 'taskCode',
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
      }),

      columnHelper.accessor((row) => row.title, {
        id: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row, getValue }) => (
          <EditableCell
            displayValue={
              <HoverLink
                href={`/app/projects/${row.original.projectName}/edit/${row.original.id}`}
                className="hover:underline underline-offset-4"
              >
                {getValue()}
              </HoverLink>
            }
            value={getValue()}
            onSave={(value) =>
              handleFieldUpdate(row.original, 'title', value as string)
            }
            type={EditableCellType.TEXT}
          />
        ),
      }),

      columnHelper.accessor((row) => row.priority, {
        id: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Priority" />
        ),
        cell: ({ row, getValue }) => (
          <EditableCell
            displayValue={capitalize((getValue() as string).replace('_', ' '))}
            value={getValue()}
            onSave={(value) =>
              handleFieldUpdate(row.original, 'priority', value as PriorityType)
            }
            options={Object.keys(PriorityType).map((priority) => ({
              label: String(capitalize(priority.replace('_', ' '))),
              value: priority,
            }))}
            type={EditableCellType.SELECT}
          />
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      }),

      columnHelper.accessor((row) => row.status, {
        id: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row, getValue }) => (
          <EditableCell
            displayValue={
              <div className="flex gap-2 items-center">
                <div
                  className={`rounded-full h-2 w-2 ${getColorByTaskStatusType(
                    getValue() as string,
                  )}`}
                />
                {capitalize(getValue() as string)}
              </div>
            }
            value={getValue()}
            onSave={(value) =>
              handleFieldUpdate(row.original, 'status', value as TaskStatusType)
            }
            options={Object.keys(TaskStatusType).map((status) => ({
              label: String(capitalize(status.replace('_', ' '))),
              value: status,
            }))}
            type={EditableCellType.SELECT}
          />
        ),
      }),

      columnHelper.accessor((row) => row.assignedTo, {
        id: 'assignedTo',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Assigned To" />
        ),
        cell: ({ row, getValue }) => {
          const user = getValue() as UserResponseType | null

          return (
            <EditableCell
              displayValue={
                user ? (
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      username={user.name}
                      avatarSize={25}
                      fontSize={10}
                    />
                    {user.name}
                  </div>
                ) : (
                  ''
                )
              }
              value={user?.id}
              onSave={(value) =>
                handleFieldUpdate(row.original, 'assignedToId', value as string)
              }
              options={users.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              type={EditableCellType.SELECT}
            />
          )
        },
      }),

      columnHelper.accessor((row) => row.dueDate, {
        id: 'dueDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Estimation" />
        ),
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
      }),

      columnHelper.accessor((row) => row.tags, {
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
          const tags = getValue() as TagResponseType[]
          const tagCount = tags.length

          // If there are more than 2 tasks, we will show the "X tasks left" badge
          const remainingTasks = tagCount > 2 ? tags.slice(2) : []

          return (
            <div
              className="flex items-center cursor-default justify-left flex-wrap gap-1"
              key={`tag-${row.index}`}
            >
              {/* Render up to 2 task badges */}
              {tags.slice(0, 2).map((tag) => (
                <Badge
                  variant="outline"
                  className="flex-nowrap whitespace-nowrap text-ellipsis"
                  key={`status-item-${tag.title}`}
                >
                  {tag.title}
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
                        {task.title}
                      </div>
                    ))}
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          )
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Ellipsis className={'flex-shrink-0 w-4 h-4'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <HoverLink
                  href={`/app/projects/${row.original.projectName}/edit/${row.original.id}`}
                  className="gap-3"
                >
                  <Pencil className="h-4 w-4 " />
                  Edit Task
                </HoverLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/app/projects/${row.original.projectName}/create/task?parentId=${row.original.id}`}
                  className="gap-3"
                >
                  <BetweenHorizonalStart className="h-4 w-4 " />
                  Add Subtask
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-3"
                onClick={() =>
                  deleteMutation({
                    id: row.original.id,
                    pid: row.original.projectId,
                  })
                }
              >
                <Trash className="h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      }),
    ],
    [handleFieldUpdate, deleteMutation, users],
  )
