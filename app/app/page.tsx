'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@src/components/ui/card'
import { getColorByName } from '@src/lib/utils'
import type { Project, ProjectUser, User } from '@prisma/client'
import { CalendarDays } from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import useSWR from 'swr'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import { useState } from 'react'
import { LoadBarPulse } from '@src/components/Loading/LoadBarPulse'

const ClientAppPage = () => {
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  const { data: projects } =
    useSWR<
      (Project & {
        users: (ProjectUser & { user: User })[]
      })[]
    >('/api/db/project')

  const onRouteChange = () => {
    if (!pageLoading) {
      setPageLoading(true)
    }
  }

  return (
    <div className="flex flex-col">
      {pageLoading && <LoadBarPulse />}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-5 overflow-auto sm:overflow-visible place-content-center">
        {projects?.map((project) => (
          <Card
            key={`${project.id}-card`}
            className={`w-[50px] z-10 h-[100%] shadow-none border-none ${getColorByName(
              project.name,
            )}`}
          >
            <Link
              href={`/app/${project.name}`}
              prefetch
              onClick={onRouteChange}
              onKeyUp={onRouteChange}
            >
              <Card className="flex min-w-64 h-[92%] flex-col m-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:shadow-none bg-white dark:bg-neutral-900">
                <CardHeader
                  style={{
                    fontSize: 25,
                  }}
                  className="justify-center flex items-start m-1"
                >
                  {project.name}
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                  <div
                    style={{ fontSize: 12 }}
                    className="flex gap-2 items-center mb-2"
                  >
                    Managed By:{' '}
                    <AvatarGroup
                      usernames={
                        project?.users?.map((u) => u.user.name ?? '') ?? []
                      }
                      avatarSize={6}
                      previewAmount={2}
                      fontSize={8}
                    />
                  </div>
                  <div
                    style={{ fontSize: 11 }}
                    className="flex flex-row items-center gap-1 align-middle"
                  >
                    <CalendarDays className="w-4 h-4" />
                    {`${DateTime.fromISO(
                      new Date(project.startDate as Date).toISOString(),
                    ).toFormat('dd.MM')} - ${DateTime.fromISO(
                      new Date(project.endDate as Date).toISOString(),
                    ).toFormat('dd.MM')}`}
                  </div>
                </CardContent>
                <CardFooter />
              </Card>
            </Link>
          </Card>
        ))}
      </div>
      {projects && projects.length < 1 ? (
        <div className="flex justify-center items-center font-bold">
          You are not assigned to any projects
        </div>
      ) : null}
    </div>
  )
}

export default ClientAppPage
