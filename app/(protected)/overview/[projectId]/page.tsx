'use client'
import { type Project, Role, type Task, type User } from '@prisma/client'
import React, { useEffect, useState, type FC } from 'react'
import useSWR from 'swr'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs'
import TasksTab from '@/src/components/tabs/tasksTab'
import GanttTab from '@/src/components/tabs/ganttTab'
import { useSession } from 'next-auth/react'
import BacklogTab from '@/src/components/tabs/backlogTab'
import ListTab from '@/src/components/tabs/listTab'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/ui/breadcrumb'
import { ClipboardList, GanttChart, List, SendToBack } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const ProjectPage: FC<{ params: { [key: string]: string | string[] } }> = ({
  params,
}) => {
  const { data: session } = useSession()
  const { data: project } = useSWR<
    Project & {
      tasks: Task[]
      managedBy: User
    }
  >(`/api/db/projekt/${params.projectId}?id=${params.projectId}`)

  const projectTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'list',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <ListTab projectId={project?.id ?? ''} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <List width={15} /> List
        </div>
      ),
    },
    {
      id: 'tasks',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <TasksTab projectId={params.projectId as string} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <ClipboardList width={15} /> Tasks
        </div>
      ),
    },
    {
      id: 'gantt',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <GanttTab projectId={params.projectId as string} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <GanttChart width={15} /> Gantt
        </div>
      ),
    },
    {
      id: 'backlog',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <BacklogTab />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <SendToBack width={15} /> Backlog
        </div>
      ),
    },
  ]
  const [tab, setTab] = useState('list')

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  useEffect(() => {
    if (currentTab !== tab) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('tab', tab)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [tab, currentTab, pathname, searchParams, router])

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/overview">Overview</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt2">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="justify-center flex">
            {projectTabs.map(
              (tabHeader) =>
                session &&
                tabHeader.roles.includes(session.user.role) && (
                  <TabsTrigger style={{ fontSize: 12 }} value={tabHeader.id}>
                    {tabHeader.headerComponent}
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
    </div>
  )
}

export default ProjectPage
