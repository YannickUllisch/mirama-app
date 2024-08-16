'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@src/components/ui/card'
import { getColorByName, isTeamAdminOrOwner } from '@src/lib/utils'
import type { Project, ProjectUser, User } from '@prisma/client'
import {
  CalendarDays,
  Folder,
  Grid2x2,
  Home,
  Loader2,
  Plus,
} from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import useSWR from 'swr'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import AddProjectDialog from '@src/components/Dialogs/AddProjectDialog'
import { Button } from '@src/components/ui/button'
import { useSession } from 'next-auth/react'

const AppHomePage = () => {
  const { data: session } = useSession()
  const {
    data: projects,
    mutate,
    isLoading,
  } = useSWR<
    (Project & {
      users: (ProjectUser & { user: User })[]
    })[]
  >('/api/db/projekt')

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Home width={20} />
        <span style={{ fontSize: 20 }}>Dashboard</span>

        {isTeamAdminOrOwner(session) && (
          <>
            <span>|</span>
            <AddProjectDialog
              key={'Project Dialog'}
              mutate={mutate}
              button={
                <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                  <Plus width={15} className="ml-2" />
                  <Button
                    className="text-text"
                    style={{ fontSize: 11, textDecoration: 'none' }}
                    variant="link"
                  >
                    New Project
                  </Button>
                </div>
              }
            />
          </>
        )}
      </div>

      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-5">
          {projects?.map((project) => (
            <Card
              key={`${project.id}-card`}
              className={`w-[50px] h-[full] shadow-none border-none ${getColorByName(
                project.name,
              )}`}
            >
              <Link href={`/app/${project.name}`} legacyBehavior prefetch>
                <Card className="flex min-w-64 h-full flex-col m-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:shadow-none bg-white dark:bg-neutral-900">
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
                          project.users.map((u) => u.user.name ?? '') ?? []
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
      </div>
      {isLoading && (
        <div className="h-full w-full flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin ml-2 dark:text-white m-1" />
        </div>
      )}
    </div>
  )
}

export default AppHomePage
