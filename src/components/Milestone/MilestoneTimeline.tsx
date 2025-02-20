'use client'

import { DateTime } from 'luxon'
import { Flag } from 'lucide-react'
import { Card, CardContent } from '@src/components/ui/card'
import { cn } from '@src/lib/utils'
import type { Milestone } from '@prisma/client'

interface MilestoneTimelineProps {
  milestones: Milestone[]
}

export default function MilestoneTimeline({
  milestones,
}: MilestoneTimelineProps) {
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Find the next milestone (first one that hasn't passed)
  const now = new Date()
  const nextMilestoneIndex = sortedMilestones.findIndex(
    (milestone) => milestone.date > now,
  )

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8">Project Timeline</h2>
      <div className="relative">
        {/* Timeline line with gradient based on progress */}
        <div
          className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-border"
          style={{
            backgroundImage:
              nextMilestoneIndex > 0
                ? `linear-gradient(to bottom, ${
                    sortedMilestones[nextMilestoneIndex - 1]?.colors
                  }, ${sortedMilestones[nextMilestoneIndex]?.colors})`
                : undefined,
          }}
        />

        <div className="space-y-8">
          {sortedMilestones.map((milestone, index) => {
            const isNext = index === nextMilestoneIndex
            const isPast = milestone.date < now
            const date = DateTime.fromJSDate(new Date(milestone.date))

            // Calculate the opacity for future milestones
            const futureOpacity = isPast
              ? 1
              : isNext
                ? 0.9
                : Math.max(0.5, 1 - (index - nextMilestoneIndex) * 0.2)

            return (
              <div
                key={milestone.id}
                className={cn(
                  'relative pl-12 transition-all duration-300',
                  isNext && 'scale-102 transform',
                )}
                style={{ opacity: futureOpacity }}
              >
                {/* Flag marker with dynamic styling */}
                <div
                  className={cn(
                    'absolute left-0 p-1.5 rounded-full border-2 transition-all duration-300',
                    'bg-background',
                    isNext && 'scale-110 shadow-lg',
                    isPast && 'bg-background/50',
                  )}
                  style={{
                    borderColor: milestone.colors,
                    transform: `translateX(${isNext ? '2px' : '0px'})`,
                    boxShadow: isNext
                      ? `0 0 0 4px ${milestone.colors}15`
                      : undefined,
                  }}
                >
                  <Flag
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      isNext && 'animate-pulse',
                      isPast && 'opacity-50',
                      !isPast && !isNext && 'opacity-75',
                    )}
                    style={{
                      color: milestone.colors,
                      transform: `rotate(${isPast ? '45deg' : '0deg'})`,
                    }}
                  />
                </div>

                {/* Milestone card */}
                <Card
                  className={cn(
                    'transition-all duration-300',
                    isNext && 'ring-2 ring-offset-2',
                    'hover:shadow-lg group',
                    isPast && 'bg-muted/50',
                  )}
                  style={{
                    borderColor: `${milestone.colors}30`,
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            isPast
                              ? 'text-muted-foreground'
                              : 'group-hover:text-primary',
                          )}
                          style={{
                            color: isNext ? milestone.colors : undefined,
                          }}
                        >
                          {date.toFormat('LLL dd, yyyy')}
                        </p>
                        <h3
                          className={cn(
                            'font-medium leading-none text-lg',
                            isPast && 'text-muted-foreground',
                          )}
                        >
                          {milestone.title}
                        </h3>
                      </div>

                      {/* Status badge */}
                      <div
                        className={cn(
                          'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
                          'transition-all duration-300',
                          isPast
                            ? 'bg-muted text-muted-foreground'
                            : 'text-white',
                        )}
                        style={{
                          backgroundColor: isPast
                            ? undefined
                            : `${milestone.colors}${isNext ? 'ff' : '90'}`,
                        }}
                      >
                        <Flag className="w-3 h-3" />
                        {isPast
                          ? 'Completed'
                          : isNext
                            ? 'In Progress'
                            : 'Planned'}
                      </div>
                    </div>

                    {/* Progress indicator for current milestone */}
                    {isNext && (
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span style={{ color: milestone.colors }}>
                            {Math.min(
                              100,
                              Math.max(
                                0,
                                Math.round(
                                  ((now.getTime() -
                                    sortedMilestones[
                                      index - 1
                                    ]?.date.getTime() || 0) /
                                    (milestone.date.getTime() -
                                      sortedMilestones[
                                        index - 1
                                      ]?.date.getTime() || 1)) *
                                    100,
                                ),
                              ),
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: milestone.colors,
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((now.getTime() -
                                    sortedMilestones[
                                      index - 1
                                    ]?.date.getTime() || 0) /
                                    (milestone.date.getTime() -
                                      sortedMilestones[
                                        index - 1
                                      ]?.date.getTime() || 1)) *
                                    100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
