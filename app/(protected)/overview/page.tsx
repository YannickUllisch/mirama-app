'use client'
import UserAvatar from '@/src/components/UserAvatar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card'
import { fetcher } from '@/src/lib/utils'
import type { Project, Task, User } from '@prisma/client'
import { CalendarDays } from 'lucide-react'
import { DateTime } from 'luxon'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

const OverviewPage = () => {
  const router = useRouter()

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
      <div className="grid grid-cols-4">
        {projects?.map((project) => (
          <Card
            onClick={() => router.push(`/overview/${project.id}`)}
            className="flex w-56 flex-col m-2 cursor-pointer hover:bg-neutral-100"
          >
            <CardHeader
              style={{ fontSize: 25 }}
              className="justify-center flex items-center m-1"
            >
              {project.name}
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {' '}
              <div style={{ fontSize: 12 }} className="flex items-center gap-1">
                Managed By
                <UserAvatar
                  username={project.managedBy.name}
                  avatarSize={6}
                  fontSize={8}
                />
              </div>
              <div style={{ fontSize: 11 }} className="flex items-center ">
                <CalendarDays className="h-3 w-3 mr-1" />
                {`${DateTime.fromISO(
                  new Date(project.startDate as Date).toISOString(),
                ).toFormat('dd.MM')} - ${DateTime.fromISO(
                  new Date(project.endDate as Date).toISOString(),
                ).toFormat('dd.MM')}`}
              </div>
              <div style={{ fontSize: 11 }} className={'flex justify-center'}>
                Your Tasks: 0
              </div>
            </CardContent>
            <CardFooter />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OverviewPage
