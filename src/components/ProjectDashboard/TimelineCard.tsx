'use client'

import type { ProjectResponse } from '@server/modules/project/features/response'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip'
import {
  addDays,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  isToday,
  startOfMonth,
} from 'date-fns'
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import HoverLink from '../HoverLink'

interface TimelineCardProps {
  projects: ProjectResponse[]
  loading: boolean
}

const TimelineCard = ({ projects, loading }: TimelineCardProps) => {
  const [viewDate, setViewDate] = useState(new Date())

  const timelineStart = startOfMonth(viewDate)
  const daysToShow = 30
  const timelineEnd = addDays(timelineStart, daysToShow)

  const days = useMemo(() => {
    return Array.from({ length: daysToShow }).map((_, i) =>
      addDays(timelineStart, i),
    )
  }, [timelineStart])

  if (loading)
    return (
      <div className="w-full h-80 bg-neutral-50 dark:bg-neutral-900/50 animate-pulse rounded-2xl border border-neutral-200 dark:border-neutral-800" />
    )

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold">
              {format(viewDate, 'MMMM yyyy')}
            </span>
          </div>

          <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewDate(addDays(viewDate, -30))}
              className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-md transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewDate(new Date())}
              className="px-3 text-[10px] font-bold uppercase hover:text-blue-500"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setViewDate(addDays(viewDate, 30))}
              className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-md transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px] p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-[240px_1fr] mb-4">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2">
                Project Nodes
              </div>
              <div className="flex justify-between px-4">
                {days
                  .filter((_, i) => i % 5 === 0)
                  .map((day) => (
                    <span
                      key={day.toString()}
                      className="text-[10px] font-medium text-neutral-400 uppercase"
                    >
                      {format(day, 'MMM d')}
                    </span>
                  ))}
              </div>
            </div>

            {/* Tracks */}
            <div className="space-y-4 relative">
              {/* Today Line */}
              <div className="absolute top-0 bottom-0 left-[240px] right-0 pointer-events-none z-10">
                {days.map(
                  (day, i) =>
                    isToday(day) && (
                      <div
                        key="today"
                        className="absolute h-full w-px bg-red-500/40"
                        style={{ left: `${(i / daysToShow) * 100}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 mt-[-4px]" />
                      </div>
                    ),
                )}
              </div>

              {projects.map((project) => {
                const pStart = new Date(project.startDate)
                const pEnd = new Date(project.endDate)

                // Calculate display constraints
                const startClamp = isBefore(pStart, timelineStart)
                  ? timelineStart
                  : pStart
                const endClamp = isAfter(pEnd, timelineEnd) ? timelineEnd : pEnd

                const offsetDays = differenceInDays(startClamp, timelineStart)
                const durationDays = differenceInDays(endClamp, startClamp)

                // If project is outside current 30-day window, don't render track
                if (
                  isAfter(pStart, timelineEnd) ||
                  isBefore(pEnd, timelineStart)
                )
                  return null

                const leftPercent = (offsetDays / daysToShow) * 100
                const widthPercent = (durationDays / daysToShow) * 100

                return (
                  <div
                    key={project.id}
                    className="grid grid-cols-[240px_1fr] items-center group/row"
                  >
                    <div className="pr-6">
                      <HoverLink href={`/app/projects/${project.name}`}>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold truncate group-hover/row:text-blue-500 transition-colors">
                            {project.name}
                          </h4>
                          <ArrowUpRight className="w-3 h-3 text-neutral-300 opacity-0 group-hover/row:opacity-100" />
                        </div>
                      </HoverLink>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase">
                          {project.priority}
                        </span>
                        <span className="text-[9px] text-neutral-300">•</span>
                        <span className="text-[9px] text-neutral-400 font-bold uppercase">
                          {project.milestones.length} Pips
                        </span>
                      </div>
                    </div>

                    <div className="relative h-10 flex items-center">
                      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-100 dark:border-neutral-800/50" />

                      {/* Project Bar - Fixed Width Logic */}
                      <div
                        className="absolute h-6 rounded-lg bg-blue-500 border-b-2 border-blue-700 z-0 flex items-center px-3"
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          minWidth: '4px',
                        }}
                      >
                        <span className="text-[8px] font-black text-white/80 uppercase truncate">
                          {widthPercent > 10 ? project.status : ''}
                        </span>
                      </div>

                      {/* Milestones as absolute pins */}
                      {project.milestones.map((m: any, idx: number) => {
                        const mDate = new Date(m.date)
                        if (
                          isBefore(mDate, timelineStart) ||
                          isAfter(mDate, timelineEnd)
                        )
                          return null

                        const mOffset = differenceInDays(mDate, timelineStart)
                        const mPos = (mOffset / daysToShow) * 100

                        return (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <div
                                className="absolute h-8 flex flex-col items-center justify-center group/pin z-20"
                                style={{
                                  left: `${mPos}%`,
                                  transform: 'translateX(-50%)',
                                }}
                              >
                                <div className="absolute -top-1 opacity-0 group-hover/row:opacity-100 bg-black text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap transition-all">
                                  {m.title}
                                </div>
                                <div
                                  className="w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-950 shadow-xs"
                                  style={{
                                    backgroundColor: m.colors || '#3b82f6',
                                  }}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px]">
                              {m.title}
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-neutral-50/50 dark:bg-neutral-900/20 border-t border-neutral-100 dark:border-neutral-800 flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[9px] font-bold text-neutral-400 uppercase">
              Operational
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[9px] font-bold text-neutral-400 uppercase">
              Today
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default TimelineCard
