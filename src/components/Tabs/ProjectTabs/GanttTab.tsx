'use client'

import type { Task, TaskCategory, User } from '@prisma/client'
import GeneralSelect from '@src/components/Select/GeneralSelect'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@src/components/ui/context-menu'
import {
  exampleFeatures,
  exampleMarkers,
} from '@src/components/ui/roadmap-ui/content'
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
import groupBy from 'lodash.groupby'
import { EyeIcon, LinkIcon, TrashIcon } from 'lucide-react'
import { DateTime } from 'luxon'
import { type FC, SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

const GanttTab = ({ projectId }: { projectId: string }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
      subtasks: Task[]
      category: TaskCategory | null
    })[]
  >(`/api/db/task?id=${projectId}`)

  const [rangeView, setRangeView] = useState<'daily' | 'monthly' | 'quarterly'>(
    'monthly',
  )

  const groupedFeatures: Record<string, typeof tasks> = groupBy(
    tasks,
    'projectId',
  )

  const sortedGroupedTasks = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB),
    ),
  )

  const handleViewFeature = (id: string) =>
    toast.success(`Feature selected: ${id}`)

  const handleCopyLink = (id: string) => toast.success(`Copy link: ${id}`)

  const handleRemoveFeature = (id: string) =>
    toast.success(`Remove feature: ${id}`)

  const handleRemoveMarker = (id: string) =>
    toast.success(`Remove marker: ${id}`)

  const handleCreateMarker = (date: Date) =>
    toast.success(`Create marker: ${date.toISOString()}`)

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
      <GeneralSelect value={rangeView} setValue={setRangeView}>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="quarterly">Quarterly</SelectItem>
      </GeneralSelect>
      <div className="border rounded-md">
        <GanttProvider onAddItem={handleAddFeature} range={rangeView} zoom={50}>
          <GanttSidebar>
            {Object.entries(sortedGroupedTasks).map(([group, tasks]) => (
              <GanttSidebarGroup key={group} name={group}>
                {tasks?.map((task) => (
                  <GanttSidebarItem
                    key={task.id}
                    feature={{
                      endAt: DateTime.now().plus({ month: 5 }).toJSDate(),
                      id: task.id,
                      name: task.title,
                      startAt: new Date(),
                      status: { color: 'red', id: '1', name: 'onTime' },
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
              {Object.entries(sortedGroupedTasks).map(([group, tasks]) => (
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
                              endAt={DateTime.now()
                                .plus({ month: 5 })
                                .toJSDate()}
                              startAt={DateTime.now().toJSDate()}
                              id={task.id}
                              name={task.title}
                              status={{ color: 'red', id: '1', name: 'onTime' }}
                            >
                              <p className="flex-1 truncate text-xs">
                                {task.title}
                              </p>
                              {task.assignedTo && (
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback>
                                    {task.assignedTo.name.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
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
            {exampleMarkers.map((marker) => (
              <GanttMarker
                key={marker.id}
                {...marker}
                onRemove={handleRemoveMarker}
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
