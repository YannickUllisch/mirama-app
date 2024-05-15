'use client'
import UserAvatar from '@/src/components/UserAvatar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
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
      <span style={{ fontSize: 20 }} className="mb-2 font-bold">
        Project Overview
      </span>
      <Separator className="mb-10" />
      <div className="grid grid-cols-4">
        {projects?.map((project) => (
          <Card
            onClick={() => router.push(`/overview/${project.id}`)}
            className="flex w-64 flex-col m-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <CardHeader
              style={{ fontSize: 25 }}
              className="justify-center flex items-start m-1"
            >
              {project.name}
            </CardHeader>
            <CardContent className="flex flex-col items-start">
              <div style={{ fontSize: 12 }}>
                Managed By: {project.managedBy.name}
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
              <div style={{ fontSize: 11 }}>Your Tasks: 0</div>
            </CardContent>
            <CardFooter />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OverviewPage
