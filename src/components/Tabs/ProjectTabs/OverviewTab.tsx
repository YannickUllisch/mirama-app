'use client'
import { useContext } from 'react'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { DateTime } from 'luxon'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Badge } from '@ui/badge'
import { Clock, DollarSign, Flag, Users } from 'lucide-react'
import TaskTree from '@src/components/Task/TaskTree'
import type {
  Project,
  Task,
  Milestone,
  Comment,
  ProjectUser,
  User,
} from '@prisma/client'
import { Progress } from '@ui/progress'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import { TaskDistributionChart } from '@src/components/Widgets/TaskDistWidget'

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

  const completedTasks =
    tasks?.filter((task) => task.status === 'DONE').length || 0
  const totalTasks = tasks?.length || 0
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex w-full gap-2">
        <TaskTree
          projectName={projectContext?.projectName ?? ''}
          tasks={tasks ?? []}
        />
        <TaskDistributionChart />
      </div>
    </div>
  )
}

export default OverviewTab
