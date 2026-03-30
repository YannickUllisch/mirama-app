'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import { PriorityType, TaskStatusType, type TaskType } from '@prisma/client'
import type { ProjectResponse } from '@server/modules/project/features/response'
import type { TaskResponse } from '@server/modules/task/features/response'
import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
import { ProjectDataContext } from '@src/components/(application)/project/Contexts/ProjectDataContext'
import TaskContextContent from '@src/components/Task/TaskContextContent'
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@src/components/ui/roadmap-ui/list'
import { postResource } from '@src/lib/api/postResource'
import { updateResourceById } from '@src/lib/api/updateResource'
import {
  individualTaskTypes,
  isTaskTypeContainer,
} from '@src/lib/helpers/TaskTypeHelpers'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { capitalize, getColorByTaskStatusType } from '@src/lib/utils'
import { Checkbox } from '@ui/checkbox'
import { ContextMenu, ContextMenuTrigger } from '@ui/context-menu'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@ui/dropdown-menu'
import { Input } from '@ui/input'
import { CircleOff, CornerDownRight, Loader2 } from 'lucide-react'
import { DateTime } from 'luxon'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { useContext, useEffect, useRef, useState } from 'react'

// Dynamically import ViewTaskSheet
const ViewTaskSheet = dynamic(
  () => import('@src/components/Task/ViewTaskSheet'),
  {
    ssr: false, // Ensure it's only loaded on the client side
  },
)

const ListTab = ({
  project,
  tasks,
}: {
  project: ProjectResponse | null
  tasks: TaskResponse[]
}) => {
  // States
  const { data: session } = useSession()
  const [showAllTasks, setShowAllTasks] = useState(true)
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState<boolean>(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined,
  )

  const projectContext = useContext(ProjectDataContext)

  const [newItem, setNewItem] = useState<{
    status: string
    title: string
    type: TaskType
    parentId: string | undefined
  } | null>(null)

  // Refs for creating new Items
  const inputContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Functions
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      return
    }
    const status = Object.values(TaskStatusType).find(
      (status) => status === over.id,
    )
    if (!status) {
      return
    }

    const existingTask = tasks?.find((task) => active.id.toString() === task.id)
    if (existingTask?.status === status) {
      return
    }

    updateResourceById('task', active.id.toString(), { status })
  }

  const onAddItem = (
    status: string,
    type: TaskType,
    parentId: string | undefined,
  ) => {
    setNewItem({ status, title: '', type, parentId })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prev) => prev && { ...prev, title: event.target.value })
  }

  const handleInputSave = () => {
    if (newItem?.title.trim()) {
      postResource('task', {
        type: newItem.type,
        title: newItem.title.trim(),
        status: newItem.status,
        priority: PriorityType.LOW,
        projectId: projectContext?.projectId,
        assignedToId: session?.user.id,
        parentId: newItem.parentId,
        dueDate: DateTime.now().plus({ week: 1 }).toJSDate(),
      })
      // Call the final save function here
      setNewItem(null)
    }
  }

  const handleInputCancel = () => {
    setNewItem(null)
  }

  const onListItemClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsTaskSheetOpen(true)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Handling Functions will never change>
  useEffect(() => {
    if (newItem) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        if (newItem?.title.trim()) {
          handleInputSave()
        } else {
          handleInputCancel()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [newItem])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 text-text-secondary text-sm items-center justify-end">
        <Checkbox
          className="w-4 h-4"
          checked={showAllTasks}
          onCheckedChange={(e) => setShowAllTasks(Boolean(e))}
        />
        Show all Tasks
      </div>
      <ViewTaskSheet
        open={isTaskSheetOpen}
        setOpen={setIsTaskSheetOpen}
        taskId={selectedTaskId ?? ''}
      />
      <div className="flex flex-col flex-grow min-h-0 rounded-xl border">
        <ListProvider onDragEnd={handleDragEnd}>
          {Object.keys(TaskStatusType).map((status) => (
            <div
              key={`status-type-${status}`}
              className="flex flex-col flex-grow overflow-y-auto"
            >
              <ListGroup key={status} id={status}>
                <ListHeader
                  className="sticky top-0"
                  name={status}
                  addItem
                  dropdownContent={
                    <>
                      <DropdownMenuLabel className="text-xs">
                        Select Group & Type
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {tasks
                          ?.filter((task) =>
                            isTaskTypeContainer(task.type as TaskType),
                          )
                          .map((task) => (
                            <DropdownMenuSub key={`dropdown-sub-${task.id}`}>
                              <DropdownMenuSubTrigger
                                key={`task-container-${task.id}`}
                                className="flex gap-2 items-center"
                              >
                                {getTaskTypeIcon(task.type as TaskType)}
                                {task.title}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {individualTaskTypes.map((type) => (
                                    <DropdownMenuItem
                                      key={`tasktype-select-parented-${type}-${status}`}
                                      onClick={() =>
                                        onAddItem(status, type, task.id)
                                      }
                                      className="flex gap-2 items-center"
                                    >
                                      {getTaskTypeIcon(type)}
                                      {capitalize(type)}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSub key={'dropdown-sub-no-parent'}>
                        <DropdownMenuSubTrigger className="flex gap-2 items-center">
                          <CircleOff size={16} />
                          Ungrouped
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {individualTaskTypes.map((type) => (
                              <DropdownMenuItem
                                onClick={() =>
                                  onAddItem(status, type, undefined)
                                }
                                key={`tasktype-select-${type}-${status}`}
                                className="flex gap-2 items-center"
                              >
                                {getTaskTypeIcon(type)}
                                {capitalize(type)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </>
                  }
                  color={getColorByTaskStatusType(status) as string}
                />

                {!project ? (
                  <div className="w-full flex justify-center items-center min-h-[100px]">
                    <Loader2 className="h-6 w-6 animate-spin ml-2 dark:text-white m-1" />
                  </div>
                ) : (
                  <ListItems>
                    {tasks
                      ?.filter(
                        (feature) =>
                          feature.status === status &&
                          !isTaskTypeContainer(feature.type as TaskType),
                      )
                      .map((feature, index) => (
                        <ContextMenu key={`item-list-${feature.id}`}>
                          <ContextMenuTrigger>
                            <ListItem
                              key={feature.id}
                              id={feature.id}
                              name={feature.title}
                              parent={feature.status}
                              index={index}
                              onClick={() => onListItemClick(feature.id)}
                            >
                              {getTaskTypeIcon(feature.type as TaskType)}
                              <p className="m-0 flex-1 font-medium text-xs">
                                {feature.title}
                              </p>
                              {feature.parent && (
                                <div className="items-center flex gap-2 text-text-secondary text-sm">
                                  <CornerDownRight size={12} />
                                  {getTaskTypeIcon(
                                    feature.parent.type as TaskType,
                                    12,
                                  )}
                                  {feature.parent.title}
                                </div>
                              )}

                              {feature.assignedTo && (
                                <UserAvatar
                                  avatarSize={19}
                                  fontSize={8}
                                  username={feature.assignedTo.name}
                                />
                              )}
                            </ListItem>
                          </ContextMenuTrigger>
                          <TaskContextContent
                            projectName={projectContext?.projectName ?? ''}
                            taskId={feature.id}
                          />
                        </ContextMenu>
                      ))}
                    {newItem?.status === status && (
                      <div
                        className={
                          'flex cursor-grab justify-between items-center gap-2 rounded-md border bg-inherit p-2 shadow-sm'
                        }
                      >
                        <div className="gap-2 items-center flex">
                          {getTaskTypeIcon(newItem.type)}
                          <div ref={inputContainerRef}>
                            <Input
                              ref={inputRef}
                              className="w-fit border rounded p-1 h-[21px]"
                              value={newItem.title}
                              onChange={handleInputChange}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleInputSave()
                                if (e.key === 'Escape') handleInputCancel()
                              }}
                            />
                          </div>
                        </div>
                        <UserAvatar
                          avatarSize={19}
                          fontSize={8}
                          username={session?.user.name ?? ''}
                        />
                      </div>
                    )}
                  </ListItems>
                )}
              </ListGroup>
            </div>
          ))}
        </ListProvider>
      </div>
    </div>
  )
}

export default ListTab
