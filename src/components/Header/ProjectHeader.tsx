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
import { Spinner } from '@ui/spinner'

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
    <header className="mb-2 bg-white dark:bg-neutral-900 rounded-lg p-5 pb-1 overflow-hidden">
      {!project ? (
        <div className="w-full h-[140px] pb-5 flex justify-center items-center">
          <Spinner className="bg-text" size={'md'} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <h1 className="text-5xl md:text-6xl max-w-4xl tracking-tighter font-bold">
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
                avatarSize={10}
                previewAmount={4}
                fontSize={17}
              />
              <Button
                size={'icon'}
                variant={'ghost'}
                className="border-2 border-dashed rounded-full h-[45px] w-[45px]"
              >
                <UserPlus size={17} />
              </Button>
            </div>
          </div>
          <div className="flex gap-1 pt-5">
            <div className="flex gap-1 flex-col">
              <div className="flex gap-2 items-center">
                <CalendarClock size={15} />
                <span className="text-sm m-0 flex">
                  <span>
                    {`${DateTime.fromJSDate(
                      new Date(project?.startDate ?? 0),
                    ).toFormat('LLL d, yyyy')} - ${DateTime.fromJSDate(
                      new Date(project?.endDate ?? 0),
                    ).toFormat('LLL d, yyyy')}`}
                  </span>
                </span>
              </div>
              <div className="flex gap-2 items-center text-sm ">
                <Flag size={15} />
                <span>{upcomingMilestone?.title}</span>
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
