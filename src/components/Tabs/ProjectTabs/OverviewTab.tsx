'use client'
import { useContext, useMemo } from 'react'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { DateTime } from 'luxon'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Badge } from '@ui/badge'
import { CalendarDays, Clock, DollarSign, Flag, Users } from 'lucide-react'
import TaskTree from '@src/components/Task/TaskTree'
import CheckboxTaskList from '@src/components/Task/CheckboxTaskList'
import type {
  Project,
  Task,
  Milestone,
  Comment,
  ProjectUser,
  User,
} from '@prisma/client' // Import necessary types
import { Progress } from '@ui/progress'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-neutral-50 dark:bg-neutral-950/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Project Status
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-2xl font-bold">{project?.status}</div>
            <Progress value={progress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-950/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Remaining
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project?.endDate
                ? DateTime.fromJSDate(new Date(project.endDate))
                    .diffNow(['days'])
                    .toFormat("d 'days'")
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Project end:{' '}
              {project?.endDate
                ? DateTime.fromJSDate(new Date(project.endDate)).toFormat(
                    'LLL dd, yyyy',
                  )
                : 'Not set'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-950/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${project?.budget?.toLocaleString() || 0}
            </div>
            <Badge
              variant={
                project?.priority === 'HIGH'
                  ? 'destructive'
                  : project?.priority === 'MEDIUM'
                    ? 'default'
                    : 'secondary'
              }
              className="mt-2"
            >
              {project?.priority} Priority
            </Badge>
          </CardContent>
        </Card>
        <Card className="bg-neutral-50 dark:bg-neutral-950/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex justify-between">
              {projectUsers?.length || 0}
              <AvatarGroup
                usernames={projectUsers?.map((u) => u.user.name ?? '') ?? []}
                avatarSize={7}
                previewAmount={4}
                fontSize={9}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {projectUsers?.filter((u) => u.isManager).length || 0} managers
            </p>
          </CardContent>
        </Card>
      </div>
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
