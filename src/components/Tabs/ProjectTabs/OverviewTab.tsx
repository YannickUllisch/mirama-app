'use client'
import type {} from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { TaskResponseType } from '@server/domain/taskSchema'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import TaskTree from '@src/components/Task/TaskTree'
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@ui/timeline'
import { DateTime } from 'luxon'
import { useContext } from 'react'

const OverviewTab = ({
  project,
  tasks,
}: { project: ProjectResponseInput | null; tasks: TaskResponseType[] }) => {
  const projectContext = useContext(ProjectDataContext)

  return (
    <div className="space-y-6 pt-10">
      <div className="flex w-full gap-2">
        <TaskTree
          projectName={projectContext?.projectName ?? ''}
          tasks={tasks ?? []}
        />
        <Timeline defaultValue={3} orientation="horizontal">
          {project?.milestones.map((item, index) => (
            <TimelineItem key={item.id} step={index}>
              <TimelineHeader>
                <TimelineSeparator className="bg-text" />
                <TimelineDate>
                  {DateTime.fromJSDate(new Date(item.date)).toFormat(
                    'LLL dd, yyyy',
                  )}
                </TimelineDate>
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineIndicator className="border-text" />
              </TimelineHeader>
              <TimelineContent>Description</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  )
}

export default OverviewTab
