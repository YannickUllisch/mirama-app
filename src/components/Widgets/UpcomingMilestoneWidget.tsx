import { type Milestone, Project } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { format, isSameDay } from 'date-fns'
import { Clock } from 'lucide-react'
import React, { type FC } from 'react'
import { TimelineLayout } from '../Milestone/Timeline/timelineLayout'

interface Widget {
  milestones: Milestone[]
}

const UpcomingMilestoneWidget: FC<Widget> = ({ milestones }) => {
  return (
    <Card className="flex-1 p-2 bg-background">
      <CardHeader className="py-3">
        <CardTitle>Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <>
          <TimelineLayout items={milestones} animate />
        </>
        <div className="px-6">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-center gap-3 py-2 border-b last:border-0"
            >
              <div className={`h-8 w-1 rounded-full ${milestone.colors}`} />
              <div className="flex-1">
                <div className="font-medium text-sm">{milestone.title}</div>
                <div className="text-xs text-muted-foreground">
                  Project:{' '}
                  {milestones.find((p) => p.id === milestone.projectId)?.title}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>
                  {isSameDay(milestone.date, new Date())
                    ? 'Today'
                    : format(milestone.date, 'MMM d')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UpcomingMilestoneWidget
