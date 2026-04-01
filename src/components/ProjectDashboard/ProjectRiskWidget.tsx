'use client'

import type { ProjectResponse } from '@server/modules/project/features/response'
import { cn } from '@src/lib/utils'
import { TooltipProvider } from '@ui/tooltip'
import { differenceInDays, isAfter } from 'date-fns'
import {
  AlertTriangle,
  ChevronRight,
  Info,
  ShieldAlert,
  Timer,
  Zap,
} from 'lucide-react'
import { useMemo } from 'react'
import HoverLink from '../HoverLink'

interface RiskWidgetProps {
  project: ProjectResponse
  isLoading?: boolean
}

const ProjectRiskWidget = ({ project, isLoading }: RiskWidgetProps) => {
  const today = new Date()

  const riskMetrics = useMemo(() => {
    const totalDays = differenceInDays(
      new Date(project.endDate),
      new Date(project.startDate),
    )
    const daysLeft = differenceInDays(new Date(project.endDate), today)
    const overdueTasks = project.tasks.filter(
      (t) => t.status !== 'DONE' && isAfter(today, new Date(t.dueDate)),
    ).length

    // Risk Calculation Logic
    let riskScore = 0
    if (daysLeft < 7) riskScore += 40
    if (overdueTasks > 0) riskScore += 30
    if (project.priority === 'HIGH') riskScore += 20

    const riskLabel =
      riskScore > 60 ? 'CRITICAL' : riskScore > 30 ? 'ELEVATED' : 'STABLE'

    return { daysLeft, overdueTasks, riskScore, riskLabel, totalDays }
  }, [project, today])

  if (isLoading)
    return (
      <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl" />
    )

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs flex flex-col h-full">
        {/* Header: System Health */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-900/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2 rounded-lg',
                riskMetrics.riskLabel === 'CRITICAL'
                  ? 'bg-red-500/10'
                  : 'bg-(--tertiary)/10',
              )}
            >
              {riskMetrics.riskLabel === 'CRITICAL' ? (
                <ShieldAlert className="w-4 h-4 text-red-500" />
              ) : (
                <Zap className="w-4 h-4 text-(--tertiary)" />
              )}
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight">
                Health Status
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                Risk Assessment
              </span>
            </div>
          </div>

          <div
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-black tracking-widest border',
              riskMetrics.riskLabel === 'CRITICAL'
                ? 'text-red-500 border-red-500/20'
                : 'text-(--tertiary) border-(--tertiary)/20',
            )}
          >
            {riskMetrics.riskLabel}
          </div>
        </div>

        {/* Risk Grid Content */}
        <div className="p-5 flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Days Remaining Node */}
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-3 h-3 text-neutral-400" />
                <span className="text-[9px] font-bold text-neutral-500 uppercase">
                  Countdown
                </span>
              </div>
              <p className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                {riskMetrics.daysLeft}
                <span className="text-[10px] ml-1 text-neutral-400">DAYS</span>
              </p>
            </div>

            {/* Overdue Node */}
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle
                  className={cn(
                    'w-3 h-3',
                    riskMetrics.overdueTasks > 0
                      ? 'text-red-500'
                      : 'text-neutral-400',
                  )}
                />
                <span className="text-[9px] font-bold text-neutral-500 uppercase">
                  Late Nodes
                </span>
              </div>
              <p
                className={cn(
                  'text-xl font-black',
                  riskMetrics.overdueTasks > 0
                    ? 'text-red-500'
                    : 'text-neutral-900 dark:text-neutral-100',
                )}
              >
                {riskMetrics.overdueTasks}
              </p>
            </div>
          </div>

          {/* Visual Health Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase">
              <span>Buffer Integrity</span>
              <span>{100 - riskMetrics.riskScore}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-1000',
                  riskMetrics.riskLabel === 'CRITICAL'
                    ? 'bg-red-500'
                    : 'bg-(--tertiary)',
                )}
                style={{ width: `${100 - riskMetrics.riskScore}%` }}
              />
            </div>
          </div>

          {/* Critical Path Insight */}
          <div className="bg-[#1a2333]/5 dark:bg-[#1a2333]/20 border border-(--tertiary)/10 p-3 rounded-xl flex gap-3 items-start">
            <Info className="w-4 h-4 text-(--tertiary) mt-0.5" />
            <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {riskMetrics.overdueTasks > 0
                ? `Address ${riskMetrics.overdueTasks} late tasks immediately to restore temporal buffer.`
                : 'Project is currently operating within expected delivery parameters.'}
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="border-t border-neutral-100 dark:border-neutral-900">
          <HoverLink
            href={`/app/projects/${project.name}/analytics`}
            className="w-full"
          >
            <button
              type="button"
              className="w-full py-3 px-5 text-[10px] font-black uppercase text-neutral-500 hover:text-(--tertiary) transition-colors flex items-center justify-between"
            >
              Review Full Analytics
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </HoverLink>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default ProjectRiskWidget
