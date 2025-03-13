import type { Project } from '@prisma/client'
import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {
  ArrowRight,
  Calendar,
  Clock,
  Edit,
  ExternalLinkIcon,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { DateTime } from 'luxon'
import type React from 'react'
import { getDaysRemaining } from '../../../app/app/helpers'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getColorByName, isTeamAdminOrOwner } from '@src/lib/utils'
import Centering from '@ui/centering'

const ProjectCard = ({
  project,
  setRecentProjectIds,
}: {
  project: Project
  setRecentProjectIds: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const { data: session } = useSession()
  return (
    <div className="relative shadow-sm">
      <div
        className={`h-[103%] -top-0.5 w-[15px] absolute -left-1.5 rounded-full opacity-80 z-0 ${getColorByName(
          project.name,
        )}`}
      />
      <Card
        key={project.id}
        className="relative shadow-sm z-10 bg-white dark:bg-neutral-900 border border-dashed overflow-hidden group"
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
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <Link prefetch={false} href={`/app/project/${project.name}`}>
                    <DropdownMenuItem>
                      <Centering>
                        <ExternalLinkIcon size={14} />
                        <span> View Details</span>
                      </Centering>
                    </DropdownMenuItem>
                  </Link>
                  {isTeamAdminOrOwner(session) && (
                    <>
                      <Link
                        prefetch={false}
                        href={`/app/project/edit/${project.id}`}
                      >
                        <DropdownMenuItem>
                          <Centering>
                            <Edit size={14} />
                            <span> Edit Project </span>
                          </Centering>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() =>
                      setRecentProjectIds((prev: string[]) =>
                        prev.filter((id) => id !== project.id),
                      )
                    }
                  >
                    <Centering>
                      <Trash2 size={14} />
                      <span> Remove from view </span>
                    </Centering>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>
                {getDaysRemaining(project.endDate) < 0
                  ? 'Overdue'
                  : `${getDaysRemaining(project.endDate)} days left`}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-0">
          <Link href={`/app/project/${project.name}`} className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-between rounded-none h-10 px-4 text-xs border-t hover:bg-hover"
            >
              <span>View Project</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProjectCard
