'use client'
import { type Project, Role } from '@prisma/client'
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
  Map as MapIcon,
  NotepadText,
  Settings,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Separator } from '@src/components/ui/separator'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import AnalyticsTab from '@src/components/Tabs/ProjectTabs/AnalyticsTab'
import BoardTab from '@src/components/Tabs/ProjectTabs/BoardTab'
import GanttTab from '@src/components/Tabs/ProjectTabs/GanttTab'
import ListTab from '@src/components/Tabs/ProjectTabs/ListTab'
import OverviewTab from '@src/components/Tabs/ProjectTabs/OverviewTab'
import SettingsTab from '@src/components/Tabs/ProjectTabs/SettingsTab'
import { LoadBarPulse } from '@src/components/Loading/LoadBarPulse'

const ClientProjectPage = ({ params }: { params: { name: string } }) => {
  // Session
  const { data: session } = useSession({ required: true })

  // States
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  // Fetching Project by name
  const { data: project } = useSWR<Project>(
    `/api/db/project/name/${params.name}`,
  )

  const onRouteChange = () => {
    if (!pageLoading) {
      setPageLoading(true)
    }
  }

  // Tab definitions
  const projectTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'overview',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <OverviewTab />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <MapIcon width={15} /> Overview
        </div>
      ),
    },
    {
      id: 'list',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: (
        <ListTab
          projectId={project?.id ?? ''}
          projectName={project?.name ?? ''}
          onRouteChange={onRouteChange}
        />
      ),
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <LayoutList width={15} /> Task List
        </div>
      ),
    },
    {
      id: 'kanban',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: (
        <BoardTab
          projectId={project?.id ?? ''}
          session={session}
          onRouteChange={onRouteChange}
        />
      ),
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <ClipboardList width={15} /> Board
        </div>
      ),
    },
    {
      id: 'gantt',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <GanttTab />,
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
      {pageLoading && <LoadBarPulse />}
      <div className="flex items-center gap-4 dark:text-white mb-2  rounded-lg p-1 w-fit">
        <NotepadText strokeWidth={1.5} width={20} />
        <span style={{ fontSize: 20 }}>{params.name}</span>
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
