'use client'
import { type Project, Role, type Task, type User } from '@prisma/client'
import React, { useEffect, useState, type FC } from 'react'
import useSWR from 'swr'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { useSession } from 'next-auth/react'
import {
  BarChartBig,
  BookOpen,
  ClipboardList,
  GanttChart,
  List,
  Settings,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import PersonalTab from '@src/components/ProjectTabs/PersonalTab'
import BoardTab from '@src/components/ProjectTabs/BoardTab'
import AnalyticsTab from '@src/components/ProjectTabs/AnalyticsTab'
import SettingsTab from '@src/components/ProjectTabs/SettingsTab'
import GanttTab from '@src/components/ProjectTabs/GanttTab'
import ListTab from '@src/components/Header/ListTab'

const ProjectPage: FC<{ params: { [key: string]: string | string[] } }> = ({
  params,
}) => {
  const { data: session } = useSession()
  const { data: project } = useSWR<
    Project & {
      tasks: Task[]
      managedBy: User
    }
  >(`/api/db/projekt/${params.name}?name=${params.name}`)

  const projectTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'personal',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <PersonalTab tasks={project?.tasks ?? []} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <BookOpen width={15} /> Personal
        </div>
      ),
    },
    {
      id: 'list',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: (
        <ListTab
          projectName={project?.name as string}
          projectId={project?.id as string}
        />
      ),
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <List width={15} /> Task List
        </div>
      ),
    },
    {
      id: 'tasks',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <BoardTab projectName={params.name as string} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <ClipboardList width={15} /> Board
        </div>
      ),
    },
    {
      id: 'gantt',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <GanttTab tasks={project?.tasks ?? []} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <GanttChart width={15} /> Gantt
        </div>
      ),
    },
    {
      id: 'analytics',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <AnalyticsTab />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <BarChartBig width={15} /> Analytics
        </div>
      ),
    },
    {
      id: 'settings',
      roles: [Role.ADMIN, Role.OWNER],
      component: <SettingsTab project={project as Project} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <Settings width={15} /> Settings
        </div>
      ),
    },
  ]

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  const [tab, setTab] = useState(currentTab ?? 'personal')

  useEffect(() => {
    if (currentTab !== tab) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('tab', tab)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [tab, currentTab, pathname, searchParams, router])

  return (
    <div className="mt2">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="justify-center flex">
          {projectTabs.map(
            (tabHeader) =>
              session &&
              tabHeader.roles.includes(session.user.role) && (
                <TabsTrigger
                  style={{ fontSize: 12 }}
                  value={tabHeader.id}
                  key={tabHeader.id}
                >
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
  )
}

export default ProjectPage
