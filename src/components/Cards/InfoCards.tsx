import { Card, CardContent } from '@ui/card'
import { CheckCircle2, FolderOpen, TimerIcon, TrendingUp } from 'lucide-react'
import React from 'react'

const InfoCards = ({
  totalProjects,
  completedTasks,
  totalTasks,
  overdueTasks,
  averageCompletion,
}: {
  totalProjects: number
  completedTasks: number
  totalTasks: number
  overdueTasks: number
  averageCompletion: number
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-white border-dashed border dark:bg-inherit dark:shadow-neutral-800 shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Projects
              </p>
              <h3 className="text-2xl font-bold mt-1">{totalProjects}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {totalProjects > 0
                  ? `${Math.round(averageCompletion)}% avg. completion`
                  : 'No active projects'}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
              <FolderOpen className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-dashed border dark:bg-inherit dark:shadow-neutral-800 shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </p>
              <h3 className="text-2xl font-bold mt-1">{totalTasks}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {completedTasks} completed
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-dashed border dark:bg-inherit dark:shadow-neutral-800 shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {totalTasks > 0
                  ? `${Math.round((completedTasks / totalTasks) * 100)}%`
                  : '0%'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {totalTasks > 0
                  ? `${completedTasks} of ${totalTasks} tasks`
                  : 'No tasks assigned'}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-dashed border dark:bg-inherit dark:shadow-neutral-800 shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overdue Tasks
              </p>
              <h3 className="text-2xl font-bold mt-1">{overdueTasks}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {overdueTasks > 0
                  ? 'Require attention'
                  : 'All tasks on schedule'}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full">
              <TimerIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InfoCards
