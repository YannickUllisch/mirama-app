import type { Project, Task } from '@prisma/client'
import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Progress } from '@ui/progress'
import { ArrowRight, Calendar, Clock, MoreHorizontal } from 'lucide-react'
import { DateTime } from 'luxon'
import React from 'react'
import { calculateProjectProgress, getDaysRemaining } from '../helpers'
import Link from 'next/link'

const ProjectCard = ({ project }: { project: Project & { tasks: Task[] } }) => {
  return (
    <Card
      key={project.id}
      className="border-0 shadow-sm bg-white dark:bg-neutral-800 overflow-hidden hover:shadow-md transition-shadow"
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{project.name}</h3>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {DateTime.fromJSDate(new Date(project.startDate)).toFormat(
                'MMM d',
              )}{' '}
              -
              {DateTime.fromJSDate(new Date(project.endDate)).toFormat(
                'MMM d, yyyy',
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit project</DropdownMenuItem>
              <DropdownMenuItem>Archive project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span>Progress</span>
            <span>{calculateProjectProgress(project)}%</span>
          </div>
          <Progress
            value={calculateProjectProgress(project)}
            className="h-1.5 bg-neutral-100 dark:bg-neutral-700"
            indicatorClassName="bg-blue-600 dark:bg-blue-500"
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          {/* <div className="flex -space-x-2">
            {project.users?.slice(0, 3).map((user) => (
              <Avatar
                key={user.id}
                className="h-6 w-6 border-2 border-white dark:border-neutral-800"
              >
                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  {user.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {(project.users?.length || 0) > 3 && (
              <Avatar className="h-6 w-6 border-2 border-white dark:border-neutral-800">
                <AvatarFallback className="text-[10px] bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                  +{(project.users?.length || 0) - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div> */}
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{getDaysRemaining(project.endDate)} days left</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <Link href={`/app/${project.name}`} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-between rounded-none h-10 px-4 text-xs border-t hover:bg-[#f5f0e5] dark:hover:bg-neutral-700/50"
          >
            <span>View Project</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
