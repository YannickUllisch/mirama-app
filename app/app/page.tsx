'use client'
import { differenceInDays } from 'date-fns'
import useSWR from 'swr'
import {
  type Project,
  type ProjectUser,
  type Task,
  TaskStatusType,
  type User,
} from '@prisma/client'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import { Card, CardContent, CardFooter, CardHeader } from '@ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Button } from '@ui/button'
import {
  ChevronRight,
  Clock,
  FolderOpen,
  MoreHorizontal,
  Plus,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { Progress } from '@ui/progress'
import { Avatar, AvatarFallback } from '@ui/avatar'
import Link from 'next/link'
import ProjectTimeline from '@src/components/Widgets/ProjectsTimelineWidget'
import MyTasksWidget from '@src/components/Widgets/MyTasksWidget'

const Dashboard = () => {
  const { data: projects } = useSWR<
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

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date()
    return differenceInDays(endDate, today)
  }

  const calculateProjectProgress = (project: Project & { tasks: Task[] }) => {
    if (!project.tasks || project.tasks.length === 0) return 0
    const completed = project.tasks.filter(
      (task) => task.status === TaskStatusType.DONE,
    ).length
    return Math.round((completed / project.tasks.length) * 100)
  }

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full h-full">
      {/* Left Section - Takes 2/3 of the width */}
      <div className="col-span-2 p-4 grid-rows-3 h-full flex flex-col">
        {/* Upper Div */}
        <div className="h-[200px] w-full rounded-lg flex-grow flex-col flex">
          <div className="flex justify-between items-center">
            <span className="text-4xl font-bold tracking-tighter">
              Welcome Back
            </span>
            <span className="tracking-tighter text-2xl">
              {DateTime.utc().toFormat('LLL dd, yyyy')}
            </span>
          </div>
          <div className="text-lg text-muted-foreground">
            <span>
              You have{' '}
              <span className="text-foreground font-bold">
                {projects?.length || 0}
              </span>{' '}
              active projects
            </span>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 pt-3 flex-grow">
          {[0, 1, 2].map((index) => {
            const existingProj =
              projects && projects.length > index ? projects[index] : undefined

            return (
              <Card
                key={index}
                className={` ${
                  existingProj ? 'border-solid' : 'border-dashed'
                }  h-full flex flex-col bg-background  border-b border-r border-l`}
              >
                {existingProj ? (
                  <>
                    <CardHeader className=" bg-card dark:bg-neutral-900 rounded-lg flex flex-row items-center justify-between p-3 space-y-0">
                      <div className="flex items-center">
                        <div className={'w-2 h-2 rounded-full mr-2'} />
                        <h3 className="font-medium text-sm flex gap-1 items-center">
                          <FolderOpen size={14} />
                          {existingProj.name}
                        </h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit project</DropdownMenuItem>
                          <DropdownMenuItem>Archive project</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-3 flex-grow  ">
                      <div className="text-xs text-muted-foreground mb-3 gap-3 items-center flex">
                        <span>Est.</span>
                        {DateTime.fromJSDate(
                          new Date(existingProj.startDate),
                        ).toFormat('MMM d, yyyy')}{' '}
                        -{' '}
                        {DateTime.fromJSDate(
                          new Date(existingProj.endDate),
                        ).toFormat('MMM d, yyyy')}
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span>Progress</span>
                          <span>{calculateProjectProgress(existingProj)}%</span>
                        </div>
                        <Progress
                          value={calculateProjectProgress(existingProj)}
                          className="h-1.5 "
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex -space-x-2">
                          {existingProj.users?.slice(0, 3).map((user) => (
                            <Avatar
                              key={user.id}
                              className="h-6 w-6 border-2 border-background"
                            >
                              <AvatarFallback className="text-[10px]">
                                {user.userId
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {(existingProj.users?.length || 0) > 3 && (
                            <Avatar className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-[10px] bg-muted">
                                +{(existingProj.users?.length || 0) - 3}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>
                            {getDaysRemaining(existingProj.endDate)} days left
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      <Link
                        className="w-full"
                        href={`/app/${existingProj.name}`}
                      >
                        <Button
                          variant="link"
                          size="sm"
                          className="w-full text-xs"
                        >
                          View Project <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <div className="rounded-full bg-muted p-3">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span>Add New Project</span>
                  </Button>
                )}
              </Card>
            )
          })}
        </div>

        {/* Bottom Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 pt-3 gap-2 h-full">
          <div className="col-span-2 rounded-lg flex flex-col h-[400px]">
            <MyTasksWidget
              isTasksLoading={isTasksLoading}
              tasks={tasks ?? []}
              onTaskUpdate={handleTaskUpdate}
              updatePersonalTasks={mutate}
            />
          </div>
          <div className="col-span-1 border rounded-lg h-full" />
        </div>
      </div>

      {/* Right Section - Takes 1/3 of the width */}
      <div className="col-span-1 w-full flex flex-col flex-grow h-full mb-5 min-h-0">
        <ProjectTimeline projects={projects ?? []} />
      </div>
    </div>
  )
}

export default Dashboard
