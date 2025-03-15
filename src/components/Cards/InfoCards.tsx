import React from 'react'
import InfoCard from './InfoCard'
import { CheckCircle2, FolderOpen, TimerIcon, TrendingUp } from 'lucide-react'

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
      <InfoCard
        title="Active Projects"
        value={totalProjects}
        description={
          totalProjects > 0
            ? `${Math.round(averageCompletion)}% avg. completion`
            : 'No active projects'
        }
        icon={FolderOpen}
        iconBgClass="bg-red-50 dark:bg-red-900/20"
        iconColorClass="text-red-500 dark:text-red-400"
      />
      <InfoCard
        title="Total Tasks"
        value={totalTasks}
        description={`${completedTasks} completed`}
        icon={CheckCircle2}
        iconBgClass="bg-blue-50 dark:bg-blue-900/20"
        iconColorClass="text-blue-600 dark:text-blue-400"
      />
      <InfoCard
        title="Completion Rate"
        value={
          totalTasks > 0
            ? `${Math.round((completedTasks / totalTasks) * 100)}%`
            : '0%'
        }
        description={
          totalTasks > 0
            ? `${completedTasks} of ${totalTasks} tasks`
            : 'No tasks assigned'
        }
        icon={TrendingUp}
        iconBgClass="bg-green-50 dark:bg-green-900/20"
        iconColorClass="text-green-500 dark:text-green-400"
      />
      <InfoCard
        title="Overdue Tasks"
        value={overdueTasks}
        description={
          overdueTasks > 0 ? 'Require attention' : 'All tasks on schedule'
        }
        icon={TimerIcon}
        iconBgClass="bg-amber-50 dark:bg-amber-900/20"
        iconColorClass="text-amber-500 dark:text-amber-400"
      />
    </div>
  )
}

export default InfoCards
