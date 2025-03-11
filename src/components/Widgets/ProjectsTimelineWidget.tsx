'use client'

import { useEffect, useState } from 'react'
import {
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  subDays,
  addDays,
} from 'date-fns'

import { cn } from '@src/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip'
import type { Project } from '@prisma/client'

interface ProjectTimelineProps {
  projects: Project[]
  className?: string
}

const ProjectTimeline = ({ projects, className }: ProjectTimelineProps) => {
  const [today] = useState(new Date())
  const [visibleDates, setVisibleDates] = useState<Date[]>([])

  // Calculate visible date range (2 weeks before and after today)
  useEffect(() => {
    const dates: Date[] = []
    const startDate = subDays(today, 14)

    for (let i = 0; i < 29; i++) {
      dates.push(addDays(startDate, i))
    }

    setVisibleDates(dates)
  }, [today])

  // Sort projects by start date
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.endDate).getTime() - new Date(b.startDate).getTime(),
  )

  // Check if a project is active (today is between start and end dates)
  const isProjectActive = (project: Project) => {
    const start = new Date(project.startDate)
    const end = new Date(project.endDate)
    return isWithinInterval(today, { start, end })
  }

  // Calculate position and width for project bar
  const getProjectBarStyle = (project: Project) => {
    const start = new Date(project.startDate)
    const end = new Date(project.endDate)

    // Guard against empty visibleDates array
    if (visibleDates.length === 0) {
      return { display: 'none' }
    }

    // Calculate visible range
    const visibleStart = visibleDates[0]
    const visibleEnd = visibleDates[visibleDates.length - 1]

    // If project is completely outside visible range
    if (isBefore(end, visibleStart) || isAfter(start, visibleEnd)) {
      return { display: 'none' }
    }

    // Calculate start position
    const startPosition = isBefore(start, visibleStart)
      ? 0
      : ((start.getTime() - visibleStart.getTime()) /
          (visibleEnd.getTime() - visibleStart.getTime())) *
        100

    // Calculate end position
    const endPosition = isAfter(end, visibleEnd)
      ? 100
      : ((end.getTime() - visibleStart.getTime()) /
          (visibleEnd.getTime() - visibleStart.getTime())) *
        100

    // Calculate width
    const width = endPosition - startPosition

    return {
      left: `${startPosition}%`,
      width: `${width}%`,
    }
  }

  // Find today's position in the timeline
  const getTodayPosition = () => {
    if (visibleDates.length === 0) return '50%'

    const visibleStart = visibleDates[0]
    const visibleEnd = visibleDates[visibleDates.length - 1]

    return `${
      ((today.getTime() - visibleStart.getTime()) /
        (visibleEnd.getTime() - visibleStart.getTime())) *
      100
    }%`
  }

  return (
    <TooltipProvider>
      <div className={cn('w-full h-full', className)}>
        {visibleDates.length > 0 ? (
          <>
            {/* Timeline header with dates */}
            <div className="relative h-6 mb-4 text-xs text-muted-foreground">
              {visibleDates
                .filter((_, i) => i % 7 === 0)
                .map((date, i) => (
                  <div
                    key={i}
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: `${((i * 7) / (visibleDates.length - 1)) * 100}%`,
                    }}
                  >
                    {format(date, 'MMM d')}
                  </div>
                ))}
            </div>

            {/* Timeline grid */}
            <div className="relative mb-2">
              <div className="absolute inset-0 flex justify-between w-full">
                {visibleDates
                  .filter((_, i) => i % 7 === 0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="w-px h-full bg-neutral-100 dark:bg-neutral-700"
                      style={{
                        left: `${((i * 7) / (visibleDates.length - 1)) * 100}%`,
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* Today indicator */}
            <div className="relative">
              <div
                className="absolute w-px bg-red-500 dark:bg-red-400 z-10 top-0"
                style={{
                  left: getTodayPosition(),
                  height: `${sortedProjects.length * 40 + 10}px`, // Dynamically set height based on number of projects
                }}
              >
                <div className="absolute -top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 dark:bg-red-400" />
                <div className="absolute -top-6 -translate-x-1/2 text-xs font-medium text-red-500 dark:text-red-400">
                  Today
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="relative mt-8 space-y-6">
              {sortedProjects.map((project, index) => (
                <div key={project.id} className="relative h-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-neutral-100 dark:bg-neutral-700" />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'absolute h-8 rounded-md cursor-default flex items-center px-3 text-sm font-medium overflow-hidden transition-shadow',
                          isProjectActive(project)
                            ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-700'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
                        )}
                        style={{
                          ...getProjectBarStyle(project),
                          zIndex: sortedProjects.length - index, // Higher z-index for projects that appear earlier in the list
                        }}
                      >
                        <span className="truncate">{project.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-white dark:bg-neutral-800 border-0 shadow-md"
                    >
                      <div className="px-1 py-0.5">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(project.startDate), 'MMM d, yyyy')} -{' '}
                          {format(new Date(project.endDate), 'MMM d, yyyy')}
                        </p>
                        {isProjectActive(project) && (
                          <div className="mt-1 text-xs">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />
                            Active project
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading timeline...</p>
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && visibleDates.length > 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground mb-2">No projects to display</p>
            <p className="text-xs text-muted-foreground">
              Create a new project to see it on the timeline
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default ProjectTimeline
