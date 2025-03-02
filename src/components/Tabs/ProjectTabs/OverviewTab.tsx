'use client'
import { useContext } from 'react'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { DateTime } from 'luxon'
import TaskTree from '@src/components/Task/TaskTree'
import type {
  Project,
  Task,
  Milestone,
  Comment,
  ProjectUser,
  User,
} from '@prisma/client'
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

const OverviewTab = () => {
  const projectContext = useContext(ProjectDataContext)
  const { data: session } = useSession({ required: true })

  // Data
  const { data: project } = useSWR<Project>(
    projectContext ? `project/${projectContext?.projectId}` : undefined,
  )
  const { data: tasks } = useSWR<
    (Task & { subtasks: Task[]; comments: Comment[] })[]
  >(projectContext ? `task?id=${projectContext?.projectId}` : undefined)
  const { data: milestones } = useSWR<Milestone[]>(
    projectContext
      ? `project/milestones?id=${projectContext?.projectId}`
      : undefined,
  )
  const { data: projectUsers } = useSWR<(ProjectUser & { user: User })[]>(
    projectContext
      ? `projectuser?projectId=${projectContext.projectId}`
      : undefined,
  )

  return (
    <div className="space-y-6 pt-10">
      <div className="flex w-full gap-2">
        <TaskTree
          projectName={projectContext?.projectName ?? ''}
          tasks={tasks ?? []}
        />
        <Timeline defaultValue={3} orientation="horizontal">
          {milestones?.map((item, index) => (
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
