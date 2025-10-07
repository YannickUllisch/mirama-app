import type { TaskResponseType } from '@server/domain/taskSchema'
import { getColorByTaskStatusType } from '@src/lib/utils'
import { Card, CardContent } from '@ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Circle } from 'lucide-react'

interface TimelineEvent {
  date: Date
  status: string
  description: string
}

interface TimelineTabProps {
  task?: TaskResponseType
}

const TimelineTab = ({ task }: TimelineTabProps) => {
  // In a real application, you would fetch the actual timeline events from your backend
  const timelineEvents: TimelineEvent[] = [
    {
      date: task?.dateCreated || new Date(),
      status: 'CREATED',
      description: 'Task was created',
    },
    {
      date: task?.updatedAt || new Date(),
      status: task?.status || 'PENDING',
      description: `Task status updated to ${task?.status}`,
    },
  ]

  return (
    <div className="p-4">
      <Card>
        <CardContent className="relative p-4">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {timelineEvents.map((event) => (
              <div key={event.status} className="relative pl-8">
                <Circle
                  className={`absolute left-0 w-2 h-2 -translate-x-[4px] mt-2 ${getColorByTaskStatusType(
                    event.status,
                  )}`}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimelineTab
