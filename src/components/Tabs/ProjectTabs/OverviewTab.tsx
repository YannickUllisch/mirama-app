'use client'
import { TaskStatusType } from '@/prisma/generated/client'
import type { ProjectResponse } from '@server/modules/project/features/response'
import type { TaskResponse } from '@server/modules/task/features/response'
import TaskTree from '@src/components/Task/TaskTree'
import { Badge } from '@ui/badge'
import { Card } from '@ui/card'
import { Progress } from '@ui/progress'
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
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  DollarSign,
  ListTodo,
  Target,
  Users,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo } from 'react'

const OverviewTab = ({
  project,
  tasks,
}: {
  project: ProjectResponse | null
  tasks: TaskResponse[]
}) => {
  const taskStats = useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, inProgress: 0, todo: 0 }
    const completed = tasks.filter(
      (t) => t.status === TaskStatusType.DONE,
    ).length
    const inProgress = tasks.filter(
      (t) => t.status === TaskStatusType.ACTIVE,
    ).length
    const todo = tasks.filter((t) => t.status === TaskStatusType.NEW).length
    return { total: tasks.length, completed, inProgress, todo }
  }, [tasks])

  const completionPercentage = useMemo(() => {
    if (taskStats.total === 0) return 0
    return Math.round((taskStats.completed / taskStats.total) * 100)
  }, [taskStats])

  const managers = useMemo(
    () => project?.members.filter((u) => u.isInherited) ?? [],
    [project],
  )
  const teamMembers = useMemo(
    () => project?.members.filter((u) => !u.isInherited) ?? [],
    [project],
  )

  const upcomingMilestone = useMemo(() => {
    if (!project?.milestones.length) return null
    const now = new Date()
    return project.milestones
      .filter((m) => new Date(m.date) >= now)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0]
  }, [project])

  if (!project) return null

  return (
    <div className="space-y-8 py-6">
      {project.description && (
        <div className="max-w-3xl">
          <p className="text-muted-foreground text-balance leading-relaxed">
            {project.description}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Project Managers
              </h3>
              <div className="space-y-2">
                {managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {manager.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {manager.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {manager.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {teamMembers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Team Members
              </h3>
              <div className="space-y-2">
                {teamMembers.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
                {teamMembers.length > 5 && (
                  <p className="text-xs text-muted-foreground pl-2">
                    +{teamMembers.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-none bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">{completionPercentage}%</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-3 h-1" />
        </Card>

        <Card className="p-4 border-none bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background">
              <ListTodo className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold">{taskStats.total}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              {taskStats.completed}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <CircleDashed className="h-3 w-3 text-secondary" />
              {taskStats.inProgress}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Circle className="h-3 w-3" />
              {taskStats.todo}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-none bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-bold">{project.members.length}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {managers.length} {managers.length === 1 ? 'manager' : 'managers'}
          </p>
        </Card>

        <Card className="p-4 border-none bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-2xl font-bold">
                {project.budget > 0
                  ? `$${project.budget.toLocaleString()}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {project.tags.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="rounded-full">
                {tag.title}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {project.milestones.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Milestones</h2>
            {upcomingMilestone && (
              <Badge variant="outline" className="gap-2">
                <Target className="h-3 w-3" />
                Next: {upcomingMilestone.title}
              </Badge>
            )}
          </div>
          <div className="overflow-x-auto pb-4">
            <Timeline
              defaultValue={
                project.milestones.findIndex(
                  (m) => m.id === upcomingMilestone?.id,
                ) || 0
              }
              orientation="horizontal"
            >
              {project.milestones.map((milestone, index) => {
                const isPast = new Date(milestone.date) < new Date()
                return (
                  <TimelineItem key={milestone.id} step={index}>
                    <TimelineHeader>
                      <TimelineSeparator
                        className={isPast ? 'bg-primary' : 'bg-muted'}
                      />
                      <TimelineDate className="text-xs">
                        {DateTime.fromJSDate(new Date(milestone.date)).toFormat(
                          'LLL dd, yyyy',
                        )}
                      </TimelineDate>
                      <TimelineTitle className="font-medium">
                        {milestone.title}
                      </TimelineTitle>
                      <TimelineIndicator
                        className={
                          isPast
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }
                      />
                    </TimelineHeader>
                    <TimelineContent />
                  </TimelineItem>
                )
              })}
            </Timeline>
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Task Structure</h2>
          <div className="rounded-lg border bg-muted/20 p-4">
            <TaskTree projectName={project.name} tasks={tasks ?? []} />
          </div>
        </div>
      )}
    </div>
  )
}

export default OverviewTab
