'use client'
import { capitalize, fetcher, isTeamAdminOrOwner } from '@/src/lib/utils'
import { type Project, Role, type Task, type User } from '@prisma/client'
import React, { type FC } from 'react'
import useSWR from 'swr'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs'
import GeneralTab from '@/src/components/tabs/generalTab'
import TasksTab from '@/src/components/tabs/tasksTab'
import GanttTab from '@/src/components/tabs/ganttTab'
import { useSession } from 'next-auth/react'
import { Pencil } from 'lucide-react'
import BacklogTab from '@/src/components/tabs/backlogTab'
import ListTab from '@/src/components/tabs/listTab'

const ProjectPage: FC<{ params: { [key: string]: string | string[] } }> = ({
  params,
}) => {
  const { data: session } = useSession()
  const { data: project } = useSWR<
    Project & {
      tasks: Task[]
      managedBy: User
    }
  >(`/api/db/projekt/${params.projectId}?id=${params.projectId}`, fetcher)

  const projectTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
  }[] = [
    {
      id: 'general',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <GeneralTab />,
    },
    {
      id: 'List',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <ListTab projectId={project?.id ?? ''} />,
    },
    {
      id: 'tasks',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <TasksTab projectId={params.projectId as string} />,
    },
    {
      id: 'gantt',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <GanttTab />,
    },
    {
      id: 'backlog',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <BacklogTab />,
    },
  ]

  return (
    <div>
      <div className="flex items-center gap-1.5" style={{ fontSize: 20 }}>
        {project?.name}{' '}
        {isTeamAdminOrOwner(session) && (
          <Pencil width={13} strokeWidth={'2px'} />
        )}
      </div>
      <Tabs defaultValue="general" className="w-full mt-1">
        <TabsList>
          {projectTabs.map(
            (tabHeader) =>
              session &&
              tabHeader.roles.includes(session.user.role) && (
                <TabsTrigger style={{ fontSize: 12 }} value={tabHeader.id}>
                  {capitalize(tabHeader.id)}
                </TabsTrigger>
              ),
          )}
        </TabsList>
        {projectTabs.map(
          (tab) =>
            session &&
            tab.roles.includes(session.user.role) && (
              <TabsContent value={tab.id} key={`${tab.id}-tab`}>
                {tab.component}
              </TabsContent>
            ),
        )}
      </Tabs>
    </div>
  )
}

export default ProjectPage
