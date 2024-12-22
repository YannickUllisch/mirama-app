'use client'
import { type Project, Role } from '@prisma/client'
import React, { type JSX, useEffect, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import {
  ClipboardList,
  GanttChart,
  LayoutList,
  Map as MapIcon,
  Settings,
  Table2,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import AnalyticsTab from '@src/components/Tabs/ProjectTabs/AnalyticsTab'
import BoardTab from '@src/components/Tabs/ProjectTabs/BoardTab'
import GanttTab from '@src/components/Tabs/ProjectTabs/GanttTab'
import ListTab from '@src/components/Tabs/ProjectTabs/ListTab'
import OverviewTab from '@src/components/Tabs/ProjectTabs/OverviewTab'
import SettingsTab from '@src/components/Tabs/ProjectTabs/SettingsTab'

const ClientProjectPage = ({ params }: { params: { name: string } }) => {
  // Session
  const { data: session } = useSession({ required: true })

  // Fetching Project by name
  const { data: project } = useSWR<Project>(
    `/api/db/project/name/${params.name}`,
  )

  // Tab definitions
  const projectTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'overview',
      roles: Object.values(Role),
      component: (
        <OverviewTab
          projectName={project?.name ?? ''}
          projectId={project?.id ?? ''}
          session={session}
        />
      ),
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <MapIcon width={15} /> Overview
        </div>
      ),
    },
    {
      id: 'table',
      roles: Object.values(Role),
      component: (
        <ListTab
          projectId={project?.id ?? ''}
          projectName={project?.name ?? ''}
        />
      ),
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <Table2 width={15} /> Task Table
        </div>
      ),
    },
    {
      id: 'kanban',
      roles: Object.values(Role),
      component: <BoardTab projectId={project?.id ?? ''} session={session} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <ClipboardList width={15} /> Board
        </div>
      ),
    },
    {
      id: 'gantt',
      roles: Object.values(Role),
      component: <GanttTab projectId={project?.id ?? ''} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <GanttChart width={15} /> Gantt
        </div>
      ),
    },
    // {
    //   id: 'analytics',
    //   roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
    //   component: <AnalyticsTab />,
    //   headerComponent: (
    //     <div className="flex justify-center gap-1 items-center">
    //       <BarChartBig width={15} /> Analytics
    //     </div>
    //   ),
    // },
    {
      id: 'settings',
      roles: Object.values(Role),
      component: <SettingsTab projectId={project?.id ?? ''} />,
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
  const [tab, setTab] = useState(currentTab ?? 'overview')

  useEffect(() => {
    if (currentTab !== tab) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('tab', tab)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [tab, currentTab, pathname, searchParams, router])

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="flex w-full items-center gap-4 dark:text-white mb-2 pb-7 rounded-lg p-1">
        <TabsList className="inline-flex items-center justify-center border">
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
