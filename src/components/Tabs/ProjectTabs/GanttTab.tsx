'use client'
import {
  type Tag,
  TaskStatusType,
  type Milestone,
  type Task,
  type TaskCategory,
  type User,
} from '@prisma/client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import AddMilestoneDialog from '@src/components/Dialogs/AddMilestoneDialog'
import GeneralSelect from '@src/components/Select/GeneralSelect'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@src/components/ui/context-menu'
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '@src/components/ui/roadmap-ui/gantt'
import { SelectItem } from '@src/components/ui/select'
import { deleteResources } from '@src/lib/api/deleteResource'
import groupBy from 'lodash.groupby'
import { CheckSquare, EyeIcon, LinkIcon, Pencil, TrashIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import get from 'lodash/get'
import { capitalize } from '@src/lib/utils'
import { updateResourceById } from '@src/lib/api/updateResource'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@src/components/ui/sheet'
import { Checkbox } from '@src/components/ui/checkbox'
import { Label } from '@src/components/ui/label'
import ViewTaskSheet from '@src/components/Task/ViewTaskSheet'
import { Separator } from '@src/components/ui/separator'

const defaultMilestone: Milestone = {
  colors: '#FFFFFF',
  date: new Date(),
  id: '',
  projectId: '',
  title: '',
}

type TaskKey = 'assignedTo.name' | 'priority' | 'category.title' | 'status'

const groupOptions: {
  label: string
  key: TaskKey
}[] = [
  { label: 'Assigned To', key: 'assignedTo.name' },
  { label: 'Priority', key: 'priority' },
  { label: 'Category', key: 'category.title' },
  { label: 'Status', key: 'status' },
]

const GanttTab = ({
  projectId,
  projectName,
  pStartDate,
  pEndDate,
}: {
  projectId: string
  pStartDate?: Date
  pEndDate?: Date
  projectName: string
}) => {
  // General States
  const [ignoreCompleted, setIgnoreCompleted] = useState(false)
  const [rangeView, setRangeView] = useState<'daily' | 'monthly' | 'quarterly'>(
    'monthly',
  )
  const [groupKey, setGroupKey] = useState<string>('assignedTo.name')

  // Task Rleated States
  const [isTaskOpen, setIsTaskOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>()

  // Milestone States
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] =
    useState<boolean>(false)
  const [selectedMilestone, setSelectedMilestone] =
    useState<Milestone>(defaultMilestone)

  // Fetching Data
  const { data: tasks, mutate: updateTasks } = useSWR<
    (Task & {
      assignedTo: User
      subtasks: Task[]
      category: TaskCategory | null
      tags: Tag[]
    })[]
  >(`/api/db/task?id=${projectId}&ignoreCompleted=${ignoreCompleted}`)

  const { data: milestones, mutate: updateMilestones } = useSWR<Milestone[]>(
    `/api/db/project/milestones?id=${projectId}`,
  )

  // Sorting and grouping Data
  const groupedTasks = useMemo(() => {
    return groupBy(tasks, (task) => {
      const value = get(task, groupKey)
      return value !== undefined && value !== null ? value : 'Unassigned'
    })
  }, [tasks, groupKey])

  const sortedTasks = (
    tasks: (typeof groupedTasks)[keyof typeof groupedTasks],
  ) => {
    return tasks?.slice().sort((a, b) => {
      return a.id.localeCompare(b.id)
    })
  }

  // Handling Gantt Chart Events
  const handleViewFeature = (id: string) => {
    setIsTaskOpen((curr) => !curr)
    setSelectedTaskId(id)
  }

  // Copying URL of Task
  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const currentURL = window.location.origin
      navigator.clipboard.writeText(
        `${currentURL}/app/${projectName}/edit/${id}`,
      )
    }
  }

  const handleInteractMarker = (id: string) => {
    const marker = milestones?.find((milestone) => milestone.id === id)
    setSelectedMilestone(marker ?? defaultMilestone)
    setIsMilestoneDialogOpen(true)
  }

  const handleCreateMarker = (date: Date) => {
    setSelectedMilestone({ ...defaultMilestone, date: date })
    setIsMilestoneDialogOpen(true)
  }

  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return
    }
    updateResourceById(
      'task',
      id,
      { startDate: startAt, dueDate: endAt },
      { mutate: updateTasks },
    )
  }

  const handleAddFeature = (date: Date) =>
    toast.success(`Add feature: ${date.toISOString()}`)

  return (
    <>
      <div className="flex pb-4 gap-2 items-center ">
        <GeneralSelect value={rangeView} setValue={setRangeView}>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
        </GeneralSelect>
        <GeneralSelect value={groupKey} setValue={setGroupKey}>
          {groupOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </GeneralSelect>
        <div className="flex items-center space-x-2 text-text-secondary">
          <Checkbox
            className="border-text-secondary"
            checked={ignoreCompleted}
            onCheckedChange={(e) => setIgnoreCompleted(Boolean(e))}
          />
          <Label className="text-xs font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Hide Completed
          </Label>
        </div>
      </div>
      <AddMilestoneDialog
        isOpen={isMilestoneDialogOpen}
        setIsOpen={setIsMilestoneDialogOpen}
        projectId={projectId}
        mutate={updateMilestones}
        defaultMilestone={selectedMilestone}
      />
      <div className="border border-border/50 dark:border-border rounded-md">
        <GanttProvider
          endDate={pEndDate}
          startDate={pStartDate}
          onAddItem={handleAddFeature}
          range={rangeView}
          zoom={50}
        >
          <GanttSidebar>
            {Object.entries(groupedTasks).map(([group, tasks]) => (
              <GanttSidebarGroup
                key={group}
                name={capitalize(group.replace('_', ' ')).toString()}
              >
                {sortedTasks(tasks)?.map((task) => (
                  <GanttSidebarItem
                    key={task.id}
                    feature={task}
                    onSelectItem={handleViewFeature}
                  />
                ))}
              </GanttSidebarGroup>
            ))}
          </GanttSidebar>
          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              {Object.entries(groupedTasks).map(([group, tasks]) => (
                <GanttFeatureListGroup key={group}>
                  {sortedTasks(tasks)?.map((task) => (
                    <div className="flex" key={task.id}>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleViewFeature(task.id)}
                          >
                            <GanttFeatureItem
                              onMove={handleMoveFeature}
                              {...task}
                              dueDate={new Date(task.dueDate)}
                              startDate={new Date(task.startDate)}
                            >
                              <p className="flex-1 truncate text-xs">
                                {task.title}
                              </p>
                              {task.assignedTo && (
                                <UserAvatar
                                  username={task.assignedTo.name}
                                  avatarSize={17}
                                  fontSize={8}
                                />
                              )}
                            </GanttFeatureItem>
                          </button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            className="flex items-center gap-2"
                            onClick={() =>
                              updateResourceById(
                                '/task',
                                task.id,
                                { status: TaskStatusType.DONE },
                                { mutate: updateTasks },
                              )
                            }
                          >
                            <CheckSquare
                              size={16}
                              className="text-muted-foreground"
                            />
                            Mark as Complete
                          </ContextMenuItem>
                          <Separator />
                          <ContextMenuItem
                            className="flex items-center gap-2"
                            asChild
                          >
                            <Link href={`/app/${projectName}/edit/${task.id}`}>
                              <Pencil
                                size={16}
                                className="text-muted-foreground"
                              />
                              Edit Task
                            </Link>
                          </ContextMenuItem>
                          <ContextMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleCopyLink(task.id)}
                          >
                            <LinkIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            Copy link
                          </ContextMenuItem>
                          <ContextMenuItem
                            className="flex items-center gap-2 text-destructive"
                            onClick={() =>
                              deleteResources('task', [task.id], {
                                mutate: updateTasks,
                              })
                            }
                          >
                            <TrashIcon size={16} />
                            Delete Task
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </div>
                  ))}
                </GanttFeatureListGroup>
              ))}
            </GanttFeatureList>
            {milestones?.map((milestone) => (
              <GanttMarker
                key={milestone.id}
                date={new Date(milestone.date)}
                id={milestone.id}
                label={milestone.title}
                backgroundHex={milestone.colors}
                onRemove={() =>
                  deleteResources('project/milestones', [milestone.id], {
                    mutate: updateMilestones,
                  })
                }
                onInteract={handleInteractMarker}
              />
            ))}
            <GanttToday />
            <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
          </GanttTimeline>
        </GanttProvider>
      </div>
      <ViewTaskSheet
        open={isTaskOpen}
        setOpen={setIsTaskOpen}
        taskId={selectedTaskId ?? ''}
        projectName={projectName}
      />
    </>
  )
}

export default GanttTab
