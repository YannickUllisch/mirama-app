'use client'
import apiRequest from '@hooks/query'
import type { TaskStatusType } from '@prisma/client'
import PageHeader from '@src/components/PageHeader'
import MinimalistTasksWidget from '@src/components/Widgets/MinimalistTasksWidget'
import ProjectTimeline from '@src/components/Widgets/ProjectsTimelineWidget'
import RecentProjectsWidget from '@src/components/Widgets/RecentProjectsWidget'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Home, Plus } from 'lucide-react'
import { DateTime } from 'luxon'

const Dashboard = () => {
  // Hooks
  const { data: projects, isLoading: isProjectsLoading } =
    apiRequest.project.fetchAll.useQuery()
  const { data: tasks, isLoading: isTasksLoading } =
    apiRequest.task.fetchPersonal.useQuery()

  const handleTaskUpdate = async (taskId: string, status: TaskStatusType) => {
    await updateResourceByIdNoToast('task', taskId, { status })
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your projects and tasks."
        icon={Home}
      >
        <div className="text-sm text-muted-foreground">
          {DateTime.utc().toFormat('EEEE, MMMM d, yyyy')}
        </div>
      </PageHeader>

      <div className="mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <RecentProjectsWidget
              isProjectsLoading={isProjectsLoading}
              projects={projects ?? []}
            />

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

          {/* Right Column */}
          <div className="flex flex-col h-full min-h-0 space-y-4">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <span>My Tasks</span>
                {tasks && tasks.length > 0 && (
                  <span className="flex items-center justify-center text-sm h-6 w-6 bg-secondary text-white rounded-full">
                    {tasks.length}
                  </span>
                )}
              </h2>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <MinimalistTasksWidget
                tasks={tasks ?? []}
                isLoading={isTasksLoading}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
