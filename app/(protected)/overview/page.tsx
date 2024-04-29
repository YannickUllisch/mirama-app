'use client'
import GeneralAccordion from '@/src/components/GeneralAccordion'
import UserAvatar from '@/src/components/UserAvatar'
import { fetcher } from '@/src/lib/utils'
import type { Project, Task, User } from '@prisma/client'
import { CalendarDays } from 'lucide-react'
import { DateTime } from 'luxon'
import useSWR from 'swr'

const OverviewPage = () => {
  const { data: projects } = useSWR<
    (Project & {
      tasks: Task[]
      managedBy: User
    })[]
  >('/api/db/projekt/personal-dashboard', fetcher)

  return (
    <div className="flex flex-col">
      <span style={{ fontSize: 20 }} className="mb-10 font-bold">
        Overview
      </span>
      {projects?.map((project) => (
        <GeneralAccordion
          trigger={
            <div className="flex w-full justify-left gap-7 items-center">
              <div style={{ fontSize: 30, fontWeight: 'bold' }}>
                {project.name}
              </div>
              {project.managedBy ? (
                <div
                  style={{ fontSize: 12 }}
                  className="flex items-center gap-1"
                >
                  <UserAvatar
                    username={project.managedBy.name}
                    avatarSize={6}
                    fontSize={8}
                  />
                  {project.managedBy.name}
                </div>
              ) : undefined}
              <div className="flex items-center">
                <CalendarDays className="h-3 w-3 mr-1" />
                {`${DateTime.fromISO(
                  new Date(project.startDate as Date).toISOString(),
                ).toFormat('dd.MM')} - ${DateTime.fromISO(
                  new Date(project.endDate as Date).toISOString(),
                ).toFormat('dd.MM')}`}
              </div>
              <div className={'flex justify-center'}>
                Days Remaining:{' '}
                {-Math.floor(
                  DateTime.utc().diff(
                    DateTime.fromJSDate(project.endDate),
                    'days',
                  ).days,
                ) > 0
                  ? DateTime.utc().diff(
                      DateTime.fromJSDate(project.endDate),
                      'days',
                    ).days
                  : 0}
              </div>
            </div>
          }
          accordionContent={<div>yoyoy</div>}
        />
      ))}
    </div>
  )
}

export default OverviewPage
