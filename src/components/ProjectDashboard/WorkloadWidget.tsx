'use client'

import type { ProjectResponse } from '@server/modules/project/features/response'
import { Progress } from '@ui/progress'
import { TooltipProvider } from '@ui/tooltip'
import { Activity, ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'
import HoverLink from '../HoverLink'

interface WorkloadWidgetProps {
  project: ProjectResponse
  isLoading?: boolean
}

const TeamWorkloadWidget = ({ project, isLoading }: WorkloadWidgetProps) => {
  const userStats = useMemo(() => {
    return project.members.map((user) => {
      const userTasks = project.tasks.filter((t) => t.assignedToId === user.id)
      const completed = userTasks.filter((t) => t.status === 'DONE').length
      const total = userTasks.length
      const percentage = total > 0 ? (completed / total) * 100 : 0

      return {
        ...user,
        total,
        completed,
        percentage,
        isOverloaded: total > 8,
      }
    })
  }, [project])

  if (isLoading)
    return (
      <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl" />
    )

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-900/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-(--tertiary)/10 rounded-lg">
              <Activity className="w-4 h-4 text-(--tertiary)" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight">
                Team Velocity
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                Resource Allocation
              </span>
            </div>
          </div>
          <HoverLink href={`/app/projects/${project.name}/team`}>
            <button
              type="button"
              className="text-[10px] font-black uppercase text-(--tertiary) hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              Manage Team <ArrowUpRight className="w-3 h-3" />
            </button>
          </HoverLink>
        </div>

        {/* User Workload List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-900">
          {userStats.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-(--secondary) flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-neutral-800">
                    {user.name[0]}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {user.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] font-black text-neutral-900 dark:text-neutral-100 tracking-tighter">
                    {user.completed}/{user.total} TASKS
                  </span>
                  {user.isOverloaded && (
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">
                      Capacity Alert
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Track */}
              <div className="relative group/progress">
                <Progress
                  value={user.percentage}
                  className="h-1.5 bg-neutral-100 dark:bg-neutral-900"
                  // Custom style to use your tertiary color for the indicator
                  style={{ '--progress-foreground': 'var(--tertiary)' } as any}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Global Stats Footer */}
        <div className="px-5 py-4 bg-neutral-50/50 dark:bg-neutral-900/20 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">
                Active Nodes
              </span>
              <span className="text-xs font-black text-neutral-900 dark:text-neutral-100">
                {project.tasks.length}
              </span>
            </div>
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">
                Total Yield
              </span>
              <span className="text-xs font-black text-(--tertiary)">
                {Math.round(
                  (project.tasks.filter((t) => t.status === 'DONE').length /
                    project.tasks.length) *
                    100 || 0,
                )}
                %
              </span>
            </div>
          </div>

          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-3 rounded-full bg-(--tertiary) opacity-40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default TeamWorkloadWidget
