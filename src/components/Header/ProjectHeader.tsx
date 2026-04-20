import type { ProjectResponse } from '@server/modules/project/features/response'
import type { MilestoneProjectResponseInput } from '@server/modules/project/milestone/milestoneSchema'
import { capitalize } from '@src/lib/utils'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Spinner } from '@ui/spinner'
import {
  CalendarClock,
  ClockArrowUp,
  Flag,
  PanelBottomClose,
  PenIcon,
} from 'lucide-react'
import { DateTime } from 'luxon'
import type { FC } from 'react'
import AvatarGroup from '../(application)/core/Avatar/AvatarGroup'
import HoverLink from '../HoverLink'
import TaskTypeCreate from '../Task/TaskTypeCreate'

interface HeaderInterface {
  project?: ProjectResponse
  upcomingMilestone?: MilestoneProjectResponseInput
}

const ProjectHeader: FC<HeaderInterface> = ({ project, upcomingMilestone }) => {
  return (
    <header className="mb-2 bg-transparent rounded-lg p-5 pb-1 overflow-hidden">
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
              <div className="hidden sm:flex gap-1 items-center">
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
            <div className="hidden sm:flex items-center gap-3">
              <AvatarGroup
                usernames={project?.members?.map((u) => u.name) ?? []}
                avatarSize={8}
                previewAmount={4}
                fontSize={14}
              />
              {/* <UserMultiSelect
                initialUserIds={project.users.map((u) => u.id) ?? []}
                onSave={() => console.log('hey')}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  className="border-2 border-dashed rounded-full h-[35px] w-[35px]"
                  title="Add / Manage Members"
                >
                  <UserPlus size={17} />
                </Button>
              </UserMultiSelect> */}
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
                <span>Upcoming Milestone: {upcomingMilestone?.title}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-sm cursor-pointer ml-auto mt-6">
              <TaskTypeCreate projectName={'Mirama'} />
              <HoverLink href={`/app/projects/edit/${project.id}`}>
                <Button variant={'secondary'} size={'sm'}>
                  <PenIcon className="w-4 h-4" />
                  <span>Edit Project</span>
                </Button>
              </HoverLink>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default ProjectHeader
