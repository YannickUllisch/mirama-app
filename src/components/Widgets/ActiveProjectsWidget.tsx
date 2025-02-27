import { TaskStatusType, type Project, type Task } from '@prisma/client'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@ui/card'
import { Progress } from '@ui/progress'
import { Tag } from 'lucide-react'
import { DateTime } from 'luxon'
import React, { type FC } from 'react'

interface Widget {
  projects: (Project & { tasks: Task[] })[]
}

const ActiveProjectsWidget: FC<Widget> = ({ projects }) => {
  return (
    <Card className="flex flex-col bg-background">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            {
              projects?.filter(
                (p) =>
                  DateTime.fromJSDate(new Date(p.startDate)) <=
                    DateTime.now() &&
                  DateTime.fromJSDate(new Date(p.endDate)) >= DateTime.now(),
              ).length
            }{' '}
            projects in progress
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Tag className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="px-6">
          {projects?.map((project) => {
            const tasksCompleted = project.tasks.filter(
              (task) => task.status === TaskStatusType.DONE,
            ).length
            return (
              <div
                key={project.id}
                className="py-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 px-2 rounded-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {DateTime.fromJSDate(
                        new Date(project.startDate),
                      ).toFormat('MMM d')}{' '}
                      -{' '}
                      {DateTime.fromJSDate(new Date(project.endDate)).toFormat(
                        'MMM d, yyyy',
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      project.priority === 'HIGH'
                        ? 'destructive'
                        : project.priority === 'MEDIUM'
                          ? 'default'
                          : 'secondary'
                    }
                    className="text-xs"
                  >
                    {project.priority}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span>
                      {((tasksCompleted / project.tasks.length) * 100).toFixed(
                        0,
                      )}
                      %
                    </span>
                    <span>
                      {tasksCompleted}/{project.tasks.length} tasks
                    </span>
                  </div>
                  <Progress
                    value={(tasksCompleted / project.tasks.length) * 100}
                    className="h-1.5"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActiveProjectsWidget
