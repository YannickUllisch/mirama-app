'use client'
import apiRequest from '@hooks/query'
import HoverLink from '@src/components/HoverLink'
import PageHeader from '@src/components/PageHeader'
import MetricCard from '@src/components/ProjectDashboard/MetricCard'
import ProjectGrid from '@src/components/ProjectDashboard/ProjectGrid'
import MinimalistTasksWidget from '@src/components/ProjectDashboard/TaskSidebar'
import TimelineCard from '@src/components/ProjectDashboard/TimelineCard'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import { Button } from '@ui/button'
import {
  ChevronRight,
  Clock,
  Kanban,
  ListChecks,
  Plus,
  User,
} from 'lucide-react'
import { DateTime } from 'luxon'

const Dashboard = () => {
  const { data: projects, isLoading: isProjectsLoading } =
    apiRequest.project.fetchAll.useQuery()
  const { data: tasks, isLoading: isTasksLoading } =
    apiRequest.task.fetchPersonal.useQuery()

  //   const { mutateAsync: useTaskMutate, isPending: isTaskUpdatePending } =
  // apiRequest.task.update.useMutation()

  const handleTaskUpdate = async (
    _projectId: string,
    taskId: string,
    status: any,
  ) => {
    console.info(taskId, status)
    await updateResourceByIdNoToast('task', taskId, { status })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Overview"
        icon={User}
        description={DateTime.now().toFormat('EEEE, d MMMM')}
      >
        <HoverLink href={'/app/projects/create'}>
          <Button variant={'tertiary'}>
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </HoverLink>
      </PageHeader>

      <main className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
          {/* Left Content: Stats & Projects */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Active Projects"
                value={projects?.length || 0}
                icon={Kanban}
                trend="+2 this month"
              />
              <MetricCard
                label="Open Tasks"
                value={tasks?.filter((t) => t.status !== 'DONE').length || 0}
                icon={ListChecks}
              />
              <MetricCard
                label="Hours Tracked"
                value="124.5"
                icon={Clock}
                trend="On track"
              />
            </div>

            {/* Project Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Recent Projects
                </h2>
                <HoverLink href={'/app/projects'}>
                  <Button variant={'ghost'}>
                    View all <ChevronRight className="w-4 h-4" />
                  </Button>
                </HoverLink>
              </div>
              <ProjectGrid
                projects={projects || []}
                loading={isProjectsLoading}
              />
            </section>

            {/* Timeline Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Schedule</h2>
              <TimelineCard
                projects={projects || []}
                loading={isProjectsLoading}
              />
            </section>
          </div>

          {/* Right Content: Tasks Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <MinimalistTasksWidget
              tasks={tasks || []}
              isLoading={isTasksLoading}
              onTaskUpdate={handleTaskUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
