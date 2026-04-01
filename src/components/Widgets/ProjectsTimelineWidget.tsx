'use client'

import type { ProjectResponse } from '@server/modules/project/features/response'
import { cn } from '@src/lib/utils'
import { Button } from '@ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { differenceInDays, format, isWithinInterval } from 'date-fns'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flag,
  Settings2,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import HoverLink from '../HoverLink'

interface ProjectTimelineProps {
  projects: ProjectResponse[]
  className?: string
  isLoading: boolean
}

const ProjectTimeline = ({
  projects,
  className,
  isLoading,
}: ProjectTimelineProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )
  const today = useMemo(() => new Date(), [])

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      // Default to the project ending soonest
      const nextProject = projects.reduce((closest, project) => {
        const diffCurrent = Math.abs(
          differenceInDays(new Date(project.endDate), today),
        )
        const diffClosest = Math.abs(
          differenceInDays(new Date(closest.endDate), today),
        )
        return diffCurrent < diffClosest ? project : closest
      }, projects[0])
      setSelectedProjectId(nextProject.id)
    }
  }, [projects, selectedProjectId, today])

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId],
  )

  const getPosition = useCallback(
    (date: Date) => {
      if (!selectedProject) return 0
      const start = new Date(selectedProject.startDate)
      const end = new Date(selectedProject.endDate)
      const total = differenceInDays(end, start)
      const current = differenceInDays(date, start)
      return Math.min(Math.max((current / total) * 100, 0), 100)
    },
    [selectedProject],
  )

  if (isLoading) return <TimelineSkeleton />
  if (!selectedProject) return null

  const activeTasks = selectedProject.tasks.filter(
    (t) => t.status !== 'DONE',
  ).length

  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs',
        className,
      )}
    >
      {/* --- Top Control Header --- */}
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
              Timeline Projection
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium">
              Viewing schedule for {selectedProject.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedProjectId ?? ''}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger className="w-[200px] h-9 text-xs font-medium border-none bg-white dark:bg-neutral-900 shadow-xs">
              <SelectValue placeholder="Switch Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <HoverLink href={`/app/projects/${selectedProject.id}/settings`}>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-neutral-400 hover:text-blue-500"
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </HoverLink>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* --- Project Status Row --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox
            label="Priority"
            value={selectedProject.priority}
            icon={Flag}
            color={
              selectedProject.priority === 'HIGH'
                ? 'text-red-500'
                : 'text-blue-500'
            }
          />
          <StatBox
            label="Status"
            value={selectedProject.status}
            icon={AlertCircle}
            color="text-neutral-500"
          />
          <StatBox
            label="Active Tasks"
            value={activeTasks.toString()}
            icon={CheckCircle2}
            color="text-green-500"
          />
          <StatBox
            label="Team"
            value={selectedProject.members.length.toString()}
            icon={Users}
            color="text-neutral-500"
          />
        </div>

        {/* --- Visual Timeline --- */}
        <div className="relative pt-10 pb-6">
          {/* Track Background */}
          <div className="absolute top-1/2 left-0 w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full -translate-y-1/2" />

          {/* Active Duration Bar */}
          <div
            className="absolute top-1/2 h-2 bg-blue-500/20 dark:bg-blue-500/40 rounded-full -translate-y-1/2 border-l-2 border-r-2 border-blue-500"
            style={{ left: `0%`, width: `100%` }}
          />

          {/* Today Indicator */}
          {isWithinInterval(today, {
            start: selectedProject.startDate,
            end: selectedProject.endDate,
          }) && (
            <div
              className="absolute top-0 bottom-0 z-20 flex flex-col items-center group"
              style={{
                left: `${getPosition(today)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="px-2 py-0.5 bg-red-500 text-[9px] font-bold text-white rounded uppercase mb-2 shadow-lg">
                Today
              </div>
              <div className="w-0.5 flex-1 bg-red-500" />
              <div className="w-3 h-3 rounded-full border-2 border-white dark:border-neutral-950 bg-red-500 mt-[-6px]" />
            </div>
          )}

          {/* Milestones */}
          {selectedProject.milestones.map((milestone) => {
            const pos = getPosition(new Date(milestone.date))
            return (
              <div
                key={milestone.id}
                className="absolute top-1/2 z-10 -translate-y-1/2 group"
                style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-neutral-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
                  {milestone.title}
                </div>
                <div
                  className="w-4 h-4 rounded-full border-2 border-white dark:border-neutral-950 shadow-md transition-transform group-hover:scale-125 cursor-help"
                  style={{ backgroundColor: milestone.colors || '#3b82f6' }}
                />
              </div>
            )
          })}

          {/* Date Markers */}
          <div className="absolute top-full mt-4 left-0 w-full flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            <div className="flex flex-col items-start">
              <span>Start</span>
              <span className="text-neutral-900 dark:text-neutral-200">
                {format(selectedProject.startDate, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span>Hard Deadline</span>
              <span className="text-neutral-900 dark:text-neutral-200">
                {format(selectedProject.endDate, 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* --- Quick Action Footer --- */}
        <div className="pt-8 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-500">
            Current progress estimated at{' '}
            <span className="text-blue-500 font-bold">
              {Math.round(getPosition(today))}%
            </span>{' '}
            of temporal capacity.
          </p>
          <HoverLink href={`/app/projects/${selectedProject.id}`}>
            <Button
              variant="link"
              size="sm"
              className="text-blue-500 text-xs font-bold gap-1 group"
            >
              View Full Roadmap
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </HoverLink>
        </div>
      </div>
    </div>
  )
}

// Sub-component for clean stats
const StatBox = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  icon: any
  color: string
}) => (
  <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-3 h-3 text-neutral-400" />
      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
        {label}
      </span>
    </div>
    <p className={cn('text-sm font-bold truncate capitalize', color)}>
      {value}
    </p>
  </div>
)

const TimelineSkeleton = () => (
  <div className="w-full h-[400px] bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl border border-neutral-200 dark:border-neutral-800" />
)

export default ProjectTimeline
