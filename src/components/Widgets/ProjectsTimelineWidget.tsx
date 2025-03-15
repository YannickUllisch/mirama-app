'use client'

import type React from 'react'

import { useEffect, useState, useRef } from 'react'
import {
  format,
  isWithinInterval,
  differenceInDays,
  addDays,
  min,
  max,
} from 'date-fns'

import { cn, getColorByName } from '@src/lib/utils'
import { TooltipProvider } from '@ui/tooltip'
import type { Project } from '@prisma/client'
import { Spinner } from '@ui/spinner'

interface ProjectTimelineProps {
  projects: Project[]
  className?: string
}

const ProjectTimeline = ({ projects, className }: ProjectTimelineProps) => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null,
  )
  const [visibleDates, setVisibleDates] = useState<Date[]>([])
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const tooltipPortalRef = useRef<HTMLDivElement | null>(null)

  // Calculate the full date range based on all projects
  useEffect(() => {
    if (!projects || projects.length === 0) {
      setDateRange(null)
      return
    }

    // Find earliest start date and latest end date
    const startDates = projects.map((p) => new Date(p.startDate))
    const endDates = projects.map((p) => new Date(p.endDate))

    const earliestStart = min(startDates)
    const latestEnd = max(endDates)

    setDateRange({ start: earliestStart, end: latestEnd })
  }, [projects])

  // Generate all dates in the range
  useEffect(() => {
    if (!dateRange) {
      setVisibleDates([])
      return
    }

    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start) + 1

    const dates: Date[] = []
    for (let i = 0; i < totalDays; i++) {
      dates.push(addDays(start, i))
    }

    setVisibleDates(dates)
  }, [dateRange])

  // Scroll to center on today when the component mounts
  useEffect(() => {
    if (scrollContainerRef.current && visibleDates.length > 0 && dateRange) {
      const totalWidth = scrollContainerRef.current.scrollWidth
      const containerWidth = scrollContainerRef.current.clientWidth

      // Calculate today's position as a percentage of the total timeline
      const daysFromStart = differenceInDays(new Date(), dateRange.start)
      const totalDays = differenceInDays(dateRange.end, dateRange.start)
      const todayPosition = (daysFromStart / totalDays) * totalWidth

      // Center the scroll on today
      scrollContainerRef.current.scrollLeft = Math.max(
        0,
        todayPosition - containerWidth / 2,
      )
    }
  }, [visibleDates, dateRange])

  // Handle mouse move to show date on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !dateRange || visibleDates.length === 0) return

    const rect = timelineRef.current.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const percentage = relativeX / rect.width

    const totalDays = differenceInDays(dateRange.end, dateRange.start)
    const dayIndex = Math.floor(percentage * totalDays)

    if (dayIndex >= 0 && dayIndex < visibleDates.length) {
      setHoveredDate(visibleDates[dayIndex])
      setHoveredPosition(e.clientX)
    }
  }

  const handleMouseLeave = () => {
    setHoveredDate(null)
    setHoveredPosition(null)
  }

  // Sort projects by start date
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.endDate).getTime() - new Date(b.startDate).getTime(),
  )
  // Calculate position and width for project bar
  const getProjectBarStyle = (project: Project) => {
    if (!dateRange || visibleDates.length === 0) {
      return { display: 'none' }
    }

    const start = new Date(project.startDate)
    const end = new Date(project.endDate)
    const totalDays = differenceInDays(dateRange.end, dateRange.start)

    // Calculate start position
    const startDaysFromBeginning = Math.max(
      0,
      differenceInDays(start, dateRange.start),
    )
    const startPercentage = (startDaysFromBeginning / totalDays) * 100

    // Calculate end position
    const endDaysFromBeginning = Math.min(
      totalDays,
      differenceInDays(end, dateRange.start),
    )
    const endPercentage = (endDaysFromBeginning / totalDays) * 100

    // Calculate width
    const width = endPercentage - startPercentage

    return {
      left: `${startPercentage}%`,
      width: `${Math.max(2, width)}%`, // Ensure minimum width for very short projects
    }
  }

  // Find today's position in the timeline
  const getTodayPosition = () => {
    if (!dateRange || visibleDates.length === 0) return '50%'

    const totalDays = differenceInDays(dateRange.end, dateRange.start)
    const daysFromStart = differenceInDays(new Date(), dateRange.start)

    return `${(daysFromStart / totalDays) * 100}%`
  }

  // Generate date markers based on timeline length
  const getDateMarkers = () => {
    if (!dateRange || visibleDates.length === 0) return []

    const totalDays = differenceInDays(dateRange.end, dateRange.start)

    // For very short timelines (< 60 days), show more frequent markers
    if (totalDays < 60) {
      // Show every 3-4 days
      return visibleDates.filter((_, i) => i % 3 === 0)
    }

    // For medium timelines (< 180 days), show weekly markers
    if (totalDays < 180) {
      return visibleDates.filter((date) => date.getDay() === 1) // Mondays
    }

    // For longer timelines (< 365 days), show bi-weekly markers
    if (totalDays < 365) {
      return visibleDates.filter(
        (date) => date.getDate() === 1 || date.getDate() === 15,
      )
    }

    // For very long timelines, show monthly markers
    return visibleDates.filter((date) => date.getDate() === 1)
  }

  // Format date markers based on timeline length
  const formatDateMarker = (date: Date) => {
    const totalDays = dateRange
      ? differenceInDays(dateRange.end, dateRange.start)
      : 0

    if (totalDays < 60) {
      return format(date, 'MMM d')
    }
    if (totalDays < 180) {
      return format(date, 'MMM d')
    }
    if (totalDays < 365) {
      if (date.getDate() === 1) {
        return format(date, 'MMM')
      }
      return format(date, 'd')
    }
    if (date.getDate() === 1) {
      if (date.getMonth() === 0) {
        return format(date, 'yyyy')
      }
      return format(date, 'MMM')
    }
    return ''
  }

  // Get date at cursor position within a project
  const getDateAtPosition = (
    project: Project,
    cursorX: number,
    elementRect: DOMRect,
  ) => {
    if (!dateRange) return null

    const start = new Date(project.startDate)
    const end = new Date(project.endDate)

    // Calculate the percentage of the way through the element
    const relativeX = cursorX - elementRect.left
    const percentage = relativeX / elementRect.width

    // Calculate the date at this position
    const totalProjectDays = differenceInDays(end, start)
    const daysFromStart = Math.floor(percentage * totalProjectDays)

    return addDays(start, daysFromStart)
  }

  const dateMarkers = getDateMarkers()

  // Create a portal for tooltips to ensure they're not clipped
  useEffect(() => {
    // Create tooltip portal if it doesn't exist
    if (!document.getElementById('timeline-tooltip-portal')) {
      const portalDiv = document.createElement('div')
      portalDiv.id = 'timeline-tooltip-portal'
      portalDiv.style.position = 'fixed'
      portalDiv.style.top = '0'
      portalDiv.style.left = '0'
      portalDiv.style.width = '100%'
      portalDiv.style.height = '100%'
      portalDiv.style.pointerEvents = 'none'
      portalDiv.style.zIndex = '9999'
      document.body.appendChild(portalDiv)

      tooltipPortalRef.current = portalDiv
    } else {
      tooltipPortalRef.current = document.getElementById(
        'timeline-tooltip-portal',
      ) as HTMLDivElement
    }

    // Cleanup on unmount
    return () => {
      if (tooltipPortalRef.current?.parentNode) {
        tooltipPortalRef.current.parentNode.removeChild(
          tooltipPortalRef.current,
        )
      }
    }
  }, [])

  // Render tooltip in portal
  const renderTooltipInPortal = () => {
    if (
      !tooltipPortalRef.current ||
      !hoveredProject ||
      !hoveredDate ||
      hoveredPosition === null
    ) {
      return null
    }

    const project = projects.find((p) => p.id === hoveredProject)
    if (!project) return null

    const projectElement = projectRefs.current.get(hoveredProject)
    if (!projectElement) return null

    const projectRect = projectElement.getBoundingClientRect()

    // Create tooltip element
    const tooltipElement = document.createElement('div')
    tooltipElement.className = 'timeline-project-tooltip'
    tooltipElement.style.position = 'fixed'
    tooltipElement.style.left = `${hoveredPosition}px`
    tooltipElement.style.top = `${projectRect.top - 85}px` // Position above the project bar
    tooltipElement.style.transform = 'translateX(-50%)'
    tooltipElement.style.backgroundColor = 'white'
    tooltipElement.style.border = '1px solid #e5e5e5'
    tooltipElement.style.borderRadius = '4px'
    tooltipElement.style.padding = '8px'
    tooltipElement.style.zIndex = '9999'
    tooltipElement.style.pointerEvents = 'none'
    tooltipElement.style.minWidth = '200px'
    tooltipElement.style.fontSize = '12px'

    // Dark mode support
    if (document.documentElement.classList.contains('dark')) {
      tooltipElement.style.backgroundColor = '#262626'
      tooltipElement.style.border = '1px solid #404040'
      tooltipElement.style.color = '#e5e5e5'
    }

    // Add content to tooltip
    tooltipElement.innerHTML = `
      <div style="font-weight: 500; margin-bottom: 4px; font-size: 20px">${
        project.name
      }</div>
      <div style="color: ${
        document.documentElement.classList.contains('dark')
          ? '#a3a3a3'
          : '#666666'
      }; font-size: 11px;">
        ${format(new Date(project.startDate), 'MMM d, yyyy')} - ${format(
          new Date(project.endDate),
          'MMM d, yyyy',
        )}
      </div>
      <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid ${
        document.documentElement.classList.contains('dark')
          ? '#404040'
          : '#f0f0f0'
      };">
        <div style="font-weight: 500; font-size: 11px;">
          Cursor at: ${format(hoveredDate, 'MMM d, yyyy')}
        </div>
      </div>
    `

    return tooltipElement
  }

  // Update tooltip in portal
  useEffect(() => {
    if (!tooltipPortalRef.current) return

    // Clear existing tooltips
    tooltipPortalRef.current.innerHTML = ''

    // Add new tooltip if needed
    const tooltipElement = renderTooltipInPortal()
    if (tooltipElement) {
      tooltipPortalRef.current.appendChild(tooltipElement)
    }
  }, [renderTooltipInPortal])

  return (
    <TooltipProvider>
      <div className={cn('w-full h-full overflow-clip ', className)}>
        {visibleDates.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="overflow-auto pb-2 hide-scrollbar"
            style={{
              // Set a minimum width to ensure scrollability
              minWidth: '100%',
            }}
          >
            <div
              ref={timelineRef}
              className="relative"
              style={{
                // Make the content wide enough to represent the full date range
                width:
                  dateRange && visibleDates.length > 28
                    ? `${Math.max(100, (visibleDates.length / 28) * 100)}%`
                    : '100%',
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Timeline header with dates */}
              <div className="relative h-6 mb-4 text-xs text-muted-foreground">
                {dateMarkers.map((date) => (
                  <div
                    key={date.getTime()}
                    className={cn(
                      'absolute transform -translate-x-1/2',
                      date.getDate() === 1 && 'font-medium',
                    )}
                    style={{
                      left: `${
                        (differenceInDays(
                          date,
                          dateRange?.start ?? new Date(),
                        ) /
                          differenceInDays(
                            dateRange?.end ?? new Date(),
                            dateRange?.start ?? new Date(),
                          )) *
                        100
                      }%`,
                    }}
                  >
                    {formatDateMarker(date)}
                  </div>
                ))}
              </div>

              {/* Timeline grid */}
              <div className="relative mb-2 ">
                <div className="absolute inset-0 flex w-full">
                  {dateMarkers.map((date) => (
                    <div
                      key={date.getTime()}
                      className={cn(
                        'absolute w-px h-full',
                        date.getDate() === 1 && date.getMonth() === 0
                          ? 'bg-neutral-300 dark:bg-neutral-600' // Year boundaries are more prominent
                          : date.getDate() === 1
                            ? 'bg-neutral-200 dark:bg-neutral-600' // Month boundaries are somewhat prominent
                            : 'bg-neutral-100 dark:bg-neutral-700',
                      )}
                      style={{
                        left: `${
                          (differenceInDays(
                            date,
                            dateRange?.start ?? new Date(),
                          ) /
                            differenceInDays(
                              dateRange?.end ?? new Date(),
                              dateRange?.start ?? new Date(),
                            )) *
                          100
                        }%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hover date indicator */}
              {hoveredDate && hoveredPosition !== null && !hoveredProject && (
                <div
                  className="fixed z-50 px-2 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm"
                  style={{
                    left: hoveredPosition,
                    top:
                      (timelineRef.current?.getBoundingClientRect().top || 0) -
                      30,
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  {format(hoveredDate, 'EEEE, MMM d, yyyy')}
                </div>
              )}

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
              <div className="relative mt-8 space-y-6 overflow-y-auto">
                {sortedProjects.map((project) => (
                  <div key={project.id} className="relative h-8 ">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-neutral-400 dark:bg-neutral-700" />
                    </div>
                    <div
                      ref={(el) => {
                        if (el) projectRefs.current.set(project.id, el)
                      }}
                      className={cn(
                        'absolute h-8 shadow-md dark:shadow-neutral-700 rounded-full cursor-default flex items-center px-3 text-white text-sm font-medium overflow-hidden transition-shadow',
                        getColorByName(project.name),
                      )}
                      style={{
                        ...getProjectBarStyle(project),
                        zIndex: 10, // Lower z-index than tooltip
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const date = getDateAtPosition(project, e.clientX, rect)
                        if (date) {
                          setHoveredDate(date)
                          setHoveredPosition(e.clientX)
                          setHoveredProject(project.id)
                        }
                      }}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => {
                        if (hoveredProject === project.id) {
                          setHoveredProject(null)
                        }
                      }}
                    >
                      <span className="truncate">{project.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 h-40">
            <Spinner className="bg-text" />
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
