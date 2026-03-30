'use client'
import type { Milestone } from '@prisma/client'
import type { ProjectResponse } from '@server/modules/project/features/response'
import type { TaskResponse } from '@server/modules/task/features/response'
import type { MilestoneProjectResponseInput } from '@server/old/milestoneSchema'
import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
import { ProjectDataContext } from '@src/components/(application)/project/Contexts/ProjectDataContext'
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
} from '@src/components/Gantt/gantt'
import { ViewControls } from '@src/components/Gantt/ViewOptions'
import GeneralSelect from '@src/components/Select/GeneralSelect'
import TaskContextContent from '@src/components/Task/TaskContextContent'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  ContextMenu,
  ContextMenuTrigger,
} from '@src/components/ui/context-menu'
import { Label } from '@src/components/ui/label'
import { deleteResources } from '@src/lib/api/deleteResource'
import { updateResourceById } from '@src/lib/api/updateResource'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { capitalize } from '@src/lib/utils'
import get from 'lodash.get'
import groupBy from 'lodash.groupby'
import dynamic from 'next/dynamic'
import { useContext, useMemo, useState } from 'react'
import { toast } from 'sonner'
import Loading from '@/app/loading'

// Dynamically import ViewTaskSheet
const ViewTaskSheet = dynamic(
  () => import('@src/components/Task/ViewTaskSheet'),
  {
    ssr: false, // Ensure it's only loaded on the client side
  },
)

const defaultMilestone: Milestone = {
  colors: '#FFFFFF',
  date: new Date(),
  id: '',
  projectId: '',
  title: '',
}

type TaskKey = 'assignedTo.name' | 'priority' | 'status' | 'type'

const groupOptions: {
  label: string
  key: TaskKey
}[] = [
  { label: 'Assigned To', key: 'assignedTo.name' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Type', key: 'type' },
]

const GanttTab = ({
  project,
  tasks,
}: {
  project: ProjectResponse | null
  tasks: TaskResponse[]
}) => {
  // Project context
  const projectContext = useContext(ProjectDataContext)

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
  const [_isMilestoneDialogOpen, setIsMilestoneDialogOpen] =
    useState<boolean>(false)
  const [_selectedMilestone, setSelectedMilestone] =
    useState<MilestoneProjectResponseInput>(defaultMilestone)

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

  const handleInteractMarker = (id: string) => {
    const marker = project?.milestones?.find((milestone) => milestone.id === id)
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
    updateResourceById('task', id, { startDate: startAt, dueDate: endAt })
  }

  const handleAddFeature = (date: Date) =>
    toast.success(`Add feature: ${date.toISOString()}`)

  return (
    <>
      <div className="flex pb-1 gap-2 items-center pt-5">
        <ViewControls view={rangeView} onViewChange={setRangeView} />

        <GeneralSelect
          value={groupKey}
          setValue={setGroupKey}
          items={groupOptions.map((option) => ({
            label: option.label,
            value: option.key,
          }))}
        />

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
      {/* <AddMilestoneDialog
        isOpen={isMilestoneDialogOpen}
        setIsOpen={setIsMilestoneDialogOpen}
        projectId={projectContext?.projectId ?? ''}
        mutate={updateMilestones}
        defaultMilestone={selectedMilestone}
      /> */}
      <div className="border border-border/50 dark:border-border rounded-md pb-5 h-[80vh]">
        {project ? (
          <GanttProvider
            onAddItem={handleAddFeature}
            range={rangeView}
            zoom={50}
          >
            <GanttSidebar defaultWidth={280} maxWidth={400} minWidth={60}>
              {Object.entries(groupedTasks).map(([group, tasks]) => (
                <GanttSidebarGroup
                  key={group}
                  name={capitalize(group.replace('_', ' ')).toString()}
                >
                  {sortedTasks(tasks)?.map((task) => (
                    <GanttSidebarItem
                      key={task.id}
                      feature={{
                        endAt: new Date(task.dueDate),
                        id: task.id,
                        name: task.title,
                        startAt: new Date(task.startDate),
                        status: {
                          color: '#000000',
                          id: task.id,
                          name: task.status,
                        },
                      }}
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
                                endAt={new Date(task.dueDate)}
                                name={task.title}
                                startAt={new Date(task.startDate)}
                                status={{
                                  color: '#000000',
                                  id: task.id,
                                  name: task.status,
                                }}
                                id={task.id}
                              >
                                {getTaskTypeIcon(task.type as any, 12)}
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
                          <TaskContextContent
                            projectName={projectContext?.projectName ?? ''}
                            taskId={task.id}
                          />
                        </ContextMenu>
                      </div>
                    ))}
                  </GanttFeatureListGroup>
                ))}
              </GanttFeatureList>
              {project?.milestones?.map((milestone) => (
                <GanttMarker
                  key={milestone.id}
                  date={new Date(milestone.date)}
                  id={milestone.id}
                  label={milestone.title}
                  backgroundHex={milestone.colors}
                  onRemove={() =>
                    deleteResources('project/milestones', [milestone.id], {})
                  }
                  onInteract={handleInteractMarker}
                />
              ))}
              <GanttToday />
              <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
            </GanttTimeline>
          </GanttProvider>
        ) : (
          <Loading />
        )}
      </div>
      <ViewTaskSheet
        open={isTaskOpen}
        setOpen={setIsTaskOpen}
        taskId={selectedTaskId ?? ''}
      />
    </>
  )
}

export default GanttTab
