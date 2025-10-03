'use client'
import type {
  Project,
  ProjectUser,
  Task,
  TaskStatusType,
  User,
} from '@prisma/client'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import MinimalistTasksWidget from '@src/components/Widgets/MinimalistTasksWidget'
import ProjectTimeline from '@src/components/Widgets/ProjectsTimelineWidget'
import RecentProjectsWidget from '@src/components/Widgets/RecentProjectsWidget'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Separator } from '@ui/separator'
import { LineChart, Plus, Users2 } from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import useSWR from 'swr'

const Dashboard = () => {
  const { data: projects, isLoading: isProjectsLoading } = useSWR<
    (Project & {
      tasks: Task[]
      users: (ProjectUser & { user: User })[]
    })[]
  >({
    url: 'project',
    archived: 'false',
    select: {
      name: true,
      startDate: true,
      endDate: true,
      priority: true,
      tasks: true,
    },
  })

  const {
    data: tasks,
    mutate,
    isLoading: isTasksLoading,
  } = useSWR<(Task & { project: Project })[]>({
    url: 'task/personal',
    select: {
      priority: true,
      taskCode: true,
      title: true,
      dueDate: true,
      status: true,
      type: true,
      project: true,
    },
  })

  const { data: teamMembers } = useSWR<User[]>({
    url: 'team/member',
  })

  const handleTaskUpdate = async (taskId: string, status: TaskStatusType) => {
    await updateResourceByIdNoToast('task', taskId, { status })
  }

  // Calculate statistics
  // const statistics = useMemo(() => {
  //   return {
  //     totalProjects: projects?.length || 0,
  //     totalTasks: tasks?.length || 0,
  //     completedTasks:
  //       tasks?.filter((t) => t.status === TaskStatusType.DONE).length || 0,
  //     overdueTasks:
  //       tasks?.filter(
  //         (t) =>
  //           t.status !== TaskStatusType.DONE &&
  //           new Date(t.dueDate) < new Date(),
  //       ).length || 0,
  //     averageCompletion:
  //       (projects?.reduce((acc, project) => {
  //         return acc + calculateProjectProgress(project)
  //       }, 0) ?? 0) / (projects?.length || 1),
  //   }
  // }, [projects, tasks])

  return (
    <div className=" dark:bg-neutral-900">
      <div className="mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-semibold tracking-tighter">
              Dashboard
            </h1>
            <div className="text-sm text-muted-foreground">
              {DateTime.utc().toFormat('EEEE, MMMM d, yyyy')}
            </div>
          </div>
          <p className="text-muted-foreground tracking-tighter">
            Welcome back. Here's an overview of your projects and tasks.
          </p>
        </div>

        {/* Statistics Section
        <InfoCards
          averageCompletion={statistics.averageCompletion}
          completedTasks={statistics.completedTasks}
          overdueTasks={statistics.overdueTasks}
          totalProjects={statistics.totalProjects}
          totalTasks={statistics.totalTasks}
        /> */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <RecentProjectsWidget
              isProjectsLoading={isProjectsLoading}
              projects={projects ?? []}
            />

            {/* Tasks Section */}
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                  <span>My Tasks</span>
                  {tasks && tasks.length > 0 && (
                    <span className="text-sm px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                      {tasks.length}
                    </span>
                  )}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
              <MinimalistTasksWidget
                tasks={tasks || []}
                isLoading={isTasksLoading}
                onTaskUpdate={handleTaskUpdate}
                mutate={mutate}
              />
            </>
          </div>

          {/* Right Column - Timeline & Activity */}
          <div className="space-y-4">
            {/* Activity Summary */}
            <Card className=" bg-neutral-50 dark:bg-background border-none">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[180px]">
                  <span className="text-text/70 text-sm">Coming soon..</span>
                </div>
                <Separator className="my-4" />

                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Team Activity</div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <AvatarGroup
                        avatarSize={8}
                        fontSize={13}
                        previewAmount={5}
                        usernames={teamMembers?.map((user) => user.name) ?? []}
                      />
                    </div>
                    <Link href={'/app/team'} prefetch={false}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Users2 className="h-3 w-3" />
                        View Team
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-50 dark:bg-background border-none">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-medium">
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[400px] overflow-auto">
                  <ProjectTimeline projects={projects ?? []} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
