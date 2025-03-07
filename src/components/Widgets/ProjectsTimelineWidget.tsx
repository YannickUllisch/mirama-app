'use client'

import { useEffect, useState } from 'react'
import {
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
  subDays,
  addDays,
} from 'date-fns'

import { cn } from '@src/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
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

export default function ProjectTimeline({
  projects,
  className,
}: ProjectTimelineProps) {
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
      backgroundColor: 'bg-primary',
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
      <Card
        className={cn(
          'w-full h-full flex-grow bg-inherit border-none ',
          className,
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {visibleDates.length > 0 ? (
            <>
              {/* Timeline header with dates */}
              <div className="relative h-6 mb-2 text-xs text-muted-foreground">
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

              {/* Today indicator */}
              <div className="relative">
                <div
                  className="absolute w-px bg-primary z-10 top-7"
                  style={{
                    left: getTodayPosition(),
                    height: `${sortedProjects.length * 70 + 10}px`, // Dynamically set height based on number of projects
                  }}
                >
                  <div className="absolute -top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
                  <div className="absolute -top-6 -translate-x-1/2 text-xs font-medium">
                    Today
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="relative mt-8 space-y-10">
                {sortedProjects.map((project, index) => (
                  <div key={project.id} className="relative h-10">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-border" />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'absolute h-16 rounded-xl cursor-default flex items-center px-2 text-2xl font-bold overflow-hidden',
                            isProjectActive(project)
                              ? 'bg-secondary text-white shadow-md'
                              : 'bg-muted text-foreground border border-border',
                          )}
                          style={{
                            ...getProjectBarStyle(project),
                            zIndex: sortedProjects.length - index, // Higher z-index for projects that appear earlier in the list
                          }}
                        >
                          <span className="truncate">{project.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(project.startDate), 'MMM d, yyyy')} -{' '}
                          {format(new Date(project.endDate), 'MMM d, yyyy')}
                        </p>
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
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
