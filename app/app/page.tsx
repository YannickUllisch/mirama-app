'use client'
import useSWR from 'swr'
import {
  type Project,
  type ProjectUser,
  type Task,
  TaskStatusType,
  type User,
} from '@prisma/client'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@ui/card'
import { Button } from '@ui/button'
import { ArrowUpRight, LineChart, Plus, Users2 } from 'lucide-react'
import { DateTime } from 'luxon'
import { Progress } from '@ui/progress'
import { Avatar, AvatarFallback } from '@ui/avatar'
import Link from 'next/link'
import ProjectTimeline from '@src/components/Widgets/ProjectsTimelineWidget'
import { Separator } from '@ui/separator'
import MinimalistTasksWidget from '@src/components/Widgets/MinimalistTasksWidget'
import { useMemo } from 'react'
import InfoCards from '@src/pages/dashboard/InfoCards'
import ProjectCard from '@src/pages/dashboard/project/ProjectCard'
import { calculateProjectProgress } from '@src/pages/dashboard/helpers'
import { Skeleton } from '@ui/skeleton'

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
  } = useSWR<Task[]>({
    url: 'task/personal',
    select: {
      priority: true,
      taskCode: true,
      title: true,
      dueDate: true,
      status: true,
      type: true,
    },
  })

  const handleTaskUpdate = async (taskId: string, status: TaskStatusType) => {
    await updateResourceByIdNoToast('task', taskId, { status })
  }

  // Calculate statistics
  const statistics = useMemo(() => {
    return {
      totalProjects: projects?.length || 0,
      totalTasks: tasks?.length || 0,
      completedTasks:
        tasks?.filter((t) => t.status === TaskStatusType.DONE).length || 0,
      overdueTasks:
        tasks?.filter(
          (t) =>
            t.status !== TaskStatusType.DONE &&
            new Date(t.dueDate) < new Date(),
        ).length || 0,
      averageCompletion:
        (projects?.reduce((acc, project) => {
          return acc + calculateProjectProgress(project)
        }, 0) ?? 0) / (projects?.length || 1),
    }
  }, [projects, tasks])

  return (
    <div className=" dark:bg-neutral-900">
      <div className="mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              {DateTime.utc().toFormat('EEEE, MMMM d, yyyy')}
            </div>
          </div>
          <p className="text-muted-foreground">
            Welcome back. Here's an overview of your projects and tasks.
          </p>
        </div>

        {/* Statistics Section */}
        <InfoCards
          averageCompletion={statistics.averageCompletion}
          completedTasks={statistics.completedTasks}
          overdueTasks={statistics.overdueTasks}
          totalProjects={statistics.totalProjects}
          totalTasks={statistics.totalTasks}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                  <span>Recent Projects</span>
                  {projects && projects.length > 0 && (
                    <span className="text-sm px-2 py-0.5 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                      {projects.length}
                    </span>
                  )}
                </h2>
                <Link href={'/app/project/create'}>
                  <Button
                    size="sm"
                    className="gap-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects?.slice(0, 4).map((project) => (
                  <ProjectCard project={project} />
                ))}

                {isProjectsLoading && <Skeleton className="h-[200px] w-full" />}

                {!isProjectsLoading && (!projects || projects.length < 4) && (
                  <Card className="border border-dashed flex items-center justify-center h-[180px] bg-white dark:bg-neutral-800 hover:bg-[#f5f0e5] dark:hover:bg-neutral-700/50 transition-colors">
                    <Button variant="ghost" className="flex flex-col gap-2">
                      <div className="rounded-full bg-red-50 dark:bg-red-900/20 p-2">
                        <Plus className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Add Project
                      </span>
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
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
            </div>
          </div>

          {/* Right Column - Timeline & Activity */}
          <div className="space-y-8">
            {/* Activity Summary */}
            <Card className="border-0 shadow-sm bg-white dark:bg-neutral-800">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm">Projects</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {statistics.totalProjects}
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-sm">Active Tasks</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {statistics.totalTasks - statistics.completedTasks}
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Completed Tasks</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {statistics.completedTasks}
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm">Overdue Tasks</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {statistics.overdueTasks}
                      {statistics.overdueTasks > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-red-500" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Team Activity</div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {Array(5)
                        .fill(0)
                        .map((index) => (
                          <Avatar
                            key={index}
                            className="h-8 w-8 border-2 border-white dark:border-neutral-800"
                          >
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                              {String.fromCharCode(65 + index)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                    <Link href={'/app/team'}>
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

            {/* Timeline */}
            <Card className=" shadow-sm bg-white dark:bg-inherit border border-dashed">
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
