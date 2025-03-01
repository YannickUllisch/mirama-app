import type { Milestone, Project, User } from '@prisma/client'
import React, { type FC } from 'react'
import AvatarGroup from '../Avatar/AvatarGroup'
import TaskTypeCreate from '../Task/TaskTypeCreate'
import {
  CalendarClock,
  ClockArrowUp,
  Flag,
  Loader2,
  PanelBottomClose,
  UserPlus,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { Badge } from '@ui/badge'
import { capitalize } from '@src/lib/utils'
import { Button } from '@ui/button'

interface HeaderInterface {
  project?: Project
  users?: User[]
  upcomingMilestone?: Milestone
}

const ProjectHeader: FC<HeaderInterface> = ({
  project,
  users,
  upcomingMilestone,
}) => {
  return (
    <header className="mb-2 bg-background border rounded-lg p-5 pb-1 overflow-hidden">
      {!project ? (
        <div className="w-full h-full pb-5 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin ml-2 m-2" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <h1 className="text-5xl md:text-4xl max-w-4xl tracking-tighter font-bold">
                {project?.name}
              </h1>
              <div className="flex gap-1 items-center">
                <Badge
                  variant={'secondary'}
                  className="flex items-center gap-2"
                  title={project.status}
                >
                  <PanelBottomClose size={15} />
                  {capitalize(project.status)}
                </Badge>
                <Badge
                  variant={'outline'}
                  className="flex items-center gap-2"
                  title={project.priority}
                >
                  <ClockArrowUp size={15} />
                  {capitalize(project.priority)}
                </Badge>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 ">
              <AvatarGroup
                usernames={users?.map((u) => u.name) ?? []}
                avatarSize={7}
                previewAmount={4}
                fontSize={10}
              />
              <Button
                size={'icon'}
                variant={'ghost'}
                className="border-2 border-dashed rounded-full"
              >
                <UserPlus size={15} />
              </Button>
            </div>
          </div>
          <div className="flex gap-1 p-2">
            <div className="flex gap-5 flex-col">
              <div className="flex gap-2 items-center">
                <CalendarClock size={15} />
                <span className="text-xs mt-0.5 gap-20 flex">
                  <span>Estimation:</span>
                  <span>
                    {`${DateTime.fromJSDate(
                      new Date(project?.startDate ?? 0),
                    ).toFormat('LLL d, yyyy')} - ${DateTime.fromJSDate(
                      new Date(project?.endDate ?? 0),
                    ).toFormat('LLL d, yyyy')}`}
                  </span>
                </span>
              </div>
              <div className="flex gap-2 items-center ">
                <Flag size={15} />
                <span className="text-xs gap-6 flex">
                  <span>Upcoming Milestone:</span>
                  <span>{upcomingMilestone?.title}</span>
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-sm cursor-pointer ml-auto mt-6">
              <TaskTypeCreate projectName={'Mirama'} />
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default ProjectHeader
