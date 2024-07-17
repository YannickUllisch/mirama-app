'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card'
import { getColorByName } from '@/src/lib/utils'
import type { Project, Task, User } from '@prisma/client'
import { CalendarDays, Loader2, Plus } from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import useSWR from 'swr'

const OverviewPage = () => {
  const { data: projects } = useSWR<
    (Project & {
      tasks: Task[]
      managedBy: User
    })[]
  >('/api/db/projekt/overview')

  return (
    <div className="flex flex-col">
      <div className="flex">
        <span style={{ fontSize: 23 }} className="mb-6">
          Overview
        </span>
      </div>

      <div className="grid grid-cols-4 gap-y-5">
        {projects ? (
          projects?.map((project) => (
            <Card
              key={`${project.id}-card`}
              className={`w-[50px] shadow-none border-none ${getColorByName(
                project.name,
              )}`}
            >
              <Link href={`/overview/${project.name}`} legacyBehavior passHref>
                <Card className="flex w-64 flex-col m-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:shadow-none bg-white dark:bg-neutral-900">
                  <CardHeader
                    style={{ fontSize: 25 }}
                    className="justify-center flex items-start m-1 "
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
                  </CardContent>
                  <CardFooter />
                </Card>
              </Link>
            </Card>
          ))
        ) : (
          <Loader2 className="h-6 w-6 animate-spin ml-2 dark:text-white m-1" />
        )}
        {/* <Card className={'w-[50px] shadow-none border-none bg-green-500'}>
          <Card
            onClick={() => ''}
            className="flex w-64 flex-col m-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:shadow-none bg-white dark:bg-neutral-900"
          >
            <CardHeader
              style={{ fontSize: 25 }}
              className="justify-center flex items-start m-1 "
            >
              Create New
            </CardHeader>
            <CardContent className="flex flex-col justify-center align-middle">
              <Plus />
            </CardContent>
            <CardFooter />
          </Card>
        </Card> */}
      </div>
    </div>
  )
}

export default OverviewPage
