'use client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import { cn, getColorByName } from '@src/lib/utils'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Label } from '@ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { differenceInDays, format, isWithinInterval } from 'date-fns'
import {
  ClockArrowDown,
  FolderIcon,
  PanelBottomClose,
  PenIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface ProjectTimelineProps {
  projects: ProjectResponseInput[]
  className?: string
  isLoading: boolean
}

const ProjectTimeline = ({
  projects,
  className,
  isLoading,
}: ProjectTimelineProps) => {
  // Finding default Project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )
  useEffect(() => {
    if (projects.length > 0) {
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
  }, [projects])

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId],
  )

  // Helpers
  const visibleMilestones = useMemo(() => {
    if (!selectedProject) return []

    return selectedProject.milestones.filter((milestone) =>
      isWithinInterval(new Date(milestone.date), {
        start: new Date(selectedProject.startDate),
        end: new Date(selectedProject.endDate),
      }),
    )
  }, [selectedProject])

  const getPositionPercentage = useCallback(
    (date: Date) => {
      if (!selectedProject) return 0

      const start = new Date(selectedProject.startDate)
      const end = new Date(selectedProject.endDate)
      const totalDays = differenceInDays(end, start)
      let daysFromStart = differenceInDays(date, start)

      if (daysFromStart < 1) daysFromStart += 2
      return (daysFromStart / totalDays) * 100
    },
    [selectedProject],
  )

  const { today, isTodayVisible } = useMemo(() => {
    const today = new Date()
    const isTodayVisible = selectedProject
      ? isWithinInterval(today, {
          start: new Date(selectedProject.startDate),
          end: new Date(selectedProject.endDate),
        })
      : false
    return { today, isTodayVisible }
  }, [selectedProject])

  if (isLoading) {
    return (
      <Card className="border-none bg-background">
        <CardHeader className="p-4 pb-2">
          <div className="h-6 w-24 bg-white dark:bg-neutral-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pt-4">
            <div className="h-8 bg-white dark:bg-neutral-700 rounded animate-pulse mb-4" />
          </div>
          <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-white dark:bg-neutral-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-white dark:bg-neutral-700 rounded animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-white dark:bg-neutral-700 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  if (projects.length === 0) {
    return (
      <div
        className={cn(
          'w-full flex items-center justify-center py-12',
          className,
        )}
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No projects found</p>
          <p className="text-xs text-muted-foreground">
            Create a new project to see it on the timeline
          </p>
        </div>
      </div>
    )
  }

  if (!selectedProject) {
    return null
  }

  return (
    <Card>
      <CardHeader className="p-0 py-4 flex items-center justify-between flex-col md:flex-row">
        <CardTitle className="text-xl font-medium">Project Timeline</CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="gap-2" variant={'secondary'}>
            <ClockArrowDown size={15} />
            {selectedProject.priority}
          </Badge>

          <Badge className="gap-2" variant={'outline'}>
            <PanelBottomClose size={15} />
            {selectedProject.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="bg-background rounded-xl p-4 overflow-clip">
        <div className={cn('w-full space-y-6', className)}>
          {/* Project selector */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FolderIcon className="w-4 h-4" />
              Select Project
            </Label>

            <div className="flex items-center gap-1">
              <Button size={'sm'} variant={'ghost'}>
                <PenIcon className="w-3 h-3" />
                Edit
              </Button>
              <Select
                value={selectedProjectId || undefined}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeline container */}
          <div className="w-full">
            <div className="relative w-full" style={{ height: '120px' }}>
              {/* Milestone markers r */}
              {visibleMilestones.map((milestone) => {
                const position = getPositionPercentage(new Date(milestone.date))
                return (
                  <div
                    key={milestone.id}
                    className="absolute"
                    style={{
                      left: `${position}%`,
                      top: '0px',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div
                      style={{ backgroundColor: milestone.colors || '#6366f1' }}
                      className="w-3 h-3 absolute -top-2 left-1/2 -translate-x-1/2  rounded-full "
                    />
                    <div
                      className="w-0.5 mx-auto"
                      style={{
                        height: '70px',
                        backgroundColor: milestone.colors || '#6366f1',
                      }}
                    />
                    <div className="mt-2 text-xs font-medium text-center whitespace-nowrap max-w-[100px] truncate">
                      {milestone.title}
                    </div>
                  </div>
                )
              })}

              {isTodayVisible && (
                <div
                  className="absolute z-20"
                  style={{
                    left: `${getPositionPercentage(today)}%`,
                    top: '0px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="w-3 h-3 absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-destructive" />
                  <div
                    className="w-0.5 bg-destructive mx-auto"
                    style={{ height: '70px' }}
                  />
                  <div className="mt-7 text-xs font-medium text-white text-center whitespace-nowrap bg-primary p-1 rounded-xl z-50">
                    Today
                  </div>
                </div>
              )}

              <div
                className="absolute w-full"
                style={{
                  top: '40px',
                  height: '32px',
                }}
              >
                <div
                  className={cn(
                    'w-full h-full rounded-full shadow-md flex items-center px-4 text-white text-sm font-medium',
                    getColorByName(selectedProject.name),
                  )}
                >
                  <span className="truncate">{selectedProject.name}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-3 text-xs text-muted-foreground px-1">
              <span>
                Start: {format(new Date(selectedProject.startDate), 'MMM d')}
              </span>

              <span>
                End: {format(new Date(selectedProject.endDate), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectTimeline
