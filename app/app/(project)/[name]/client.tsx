'use client'
import {
  type Project,
  type ProjectUser,
  Role,
  type Tag,
  type Task,
  type User,
} from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import {
  BarChartBig,
  ClipboardList,
  GanttChart,
  LayoutList,
  NotepadText,
  Settings,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import BoardTab from '@src/components/ProjectTabs/BoardTab'
import AnalyticsTab from '@src/components/ProjectTabs/AnalyticsTab'
import SettingsTab from '@src/components/ProjectTabs/SettingsTab'
import GanttTab from '@src/components/ProjectTabs/GanttTab'
import ListTab from '@src/components/ProjectTabs/ListTab'
import { Separator } from '@src/components/ui/separator'
import type { Session } from 'next-auth'

const ClientProjectPage = ({
  project,
  session,
}: {
  project: Project & {
    tasks: (Task & { assignedTo: User | null; tags: Tag[] })[]
    users: (ProjectUser & { user: User })[]
  }
  session: Session
}) => {
  // Tab definitions
  const projectTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'list',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <ListTab project={project} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <LayoutList width={15} /> Task List
        </div>
      ),
    },
    {
      id: 'kanban',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <BoardTab project={project} session={session} />,
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
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: (
        <SettingsTab
          project={
            project as Project & { users: (ProjectUser & { user: User })[] }
          }
        />
      ),
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
  const [tab, setTab] = useState(currentTab ?? 'list')

  useEffect(() => {
    if (currentTab !== tab) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('tab', tab)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [tab, currentTab, pathname, searchParams, router])
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="flex items-center gap-4 dark:text-white mb-2  rounded-lg p-1 w-fit">
        <NotepadText strokeWidth={1.5} width={20} />
        <span style={{ fontSize: 20 }}>{project?.name}</span>
        <span>|</span>
        <TabsList className="justify-center">
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
      </div>
      <Separator className="m-4" />
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
  )
}

export default ClientProjectPage
