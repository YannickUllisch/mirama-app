'use client'

import { MilestoneSchema } from '@/prisma/zod'
import type { Milestone, Task, TaskCategory, User } from '@prisma/client'
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
import { EyeIcon, LinkIcon, TrashIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import get from 'lodash/get'
import { capitalize } from '@src/lib/utils'

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
  pStartDate,
  pEndDate,
}: { projectId: string; pStartDate?: Date; pEndDate?: Date }) => {
  // Fetching Data
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
      subtasks: Task[]
      category: TaskCategory | null
    })[]
  >(`/api/db/task?id=${projectId}`)

  const { data: milestones, mutate: updateMilestones } = useSWR<Milestone[]>(
    `/api/db/project/milestones?id=${projectId}`,
  )

  // Milestone States
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] =
    useState<boolean>(false)
  const [selectedMilestone, setSelectedMilestone] =
    useState<Milestone>(defaultMilestone)

  // Gantt chart States
  const [rangeView, setRangeView] = useState<'daily' | 'monthly' | 'quarterly'>(
    'monthly',
  )
  const [groupKey, setGroupKey] = useState<string>('assignedTo.name')

  const groupedTasks = useMemo(() => {
    return groupBy(tasks, (task) => {
      const value = get(task, groupKey)
      return value !== undefined ? value : 'Unassigned'
    })
  }, [tasks, groupKey])

  const handleViewFeature = (id: string) =>
    toast.success(`Feature selected: ${id}`)

  const handleCopyLink = (id: string) => toast.success(`Copy link: ${id}`)

  const handleRemoveFeature = (id: string) =>
    toast.success(`Remove feature: ${id}`)

  const handleRemoveMarker = (id: string) => {
    deleteResources('project/milestones', [id], { mutate: updateMilestones })
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

    // setFeatures((prev) =>
    //   prev.map((feature) =>
    //     feature.id === id ? { ...feature, startAt, endAt } : feature,
    //   ),
    // )

    toast.success(`Move feature: ${id} from ${startAt} to ${endAt}`)
  }

  const handleAddFeature = (date: Date) =>
    toast.success(`Add feature: ${date.toISOString()}`)

  return (
    <>
      <div className="flex pb-4 gap-2">
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
      </div>
      <AddMilestoneDialog
        isOpen={isMilestoneDialogOpen}
        setIsOpen={setIsMilestoneDialogOpen}
        projectId={projectId}
        mutate={updateMilestones}
        defaultMilestone={selectedMilestone}
      />
      <div className="border rounded-lg">
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
                {tasks?.map((task) => (
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
                  {tasks?.map((task) => (
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
                            onClick={() => handleViewFeature(task.id)}
                          >
                            <EyeIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            View feature
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
                            onClick={() => handleRemoveFeature(task.id)}
                          >
                            <TrashIcon size={16} />
                            Remove from roadmap
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
                onRemove={handleRemoveMarker}
                onInteract={handleInteractMarker}
              />
            ))}
            <GanttToday />
            <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
          </GanttTimeline>
        </GanttProvider>
      </div>
    </>
  )
}

export default GanttTab
