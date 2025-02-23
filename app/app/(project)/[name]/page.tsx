'use client'
import { Role } from '@prisma/client'
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
  Map as MapIcon,
  Settings,
  Table2,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import BoardTab from '@src/components/Tabs/ProjectTabs/BoardTab'
import GanttTab from '@src/components/Tabs/ProjectTabs/GanttTab'
import ListTab from '@src/components/Tabs/ProjectTabs/ListTab'
import OverviewTab from '@src/components/Tabs/ProjectTabs/OverviewTab'
import SettingsTab from '@src/components/Tabs/ProjectTabs/SettingsTab'

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
    component: <OverviewTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <MapIcon width={15} /> Overview
      </div>
    ),
  },
  {
    id: 'table',
    roles: Object.values(Role),
    component: <ListTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <Table2 width={15} /> Table
      </div>
    ),
  },
  {
    id: 'kanban',
    roles: Object.values(Role),
    component: <BoardTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <ClipboardList width={15} /> Board
      </div>
    ),
  },
  {
    id: 'timeline',
    roles: Object.values(Role),
    component: <GanttTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <GanttChart width={15} /> Timeline
      </div>
    ),
  },
  {
    id: 'settings',
    roles: Object.values(Role),
    component: <SettingsTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <Settings width={15} /> Settings
      </div>
    ),
  },
]

const ClientProjectPage = () => {
  // Session
  const { data: session } = useSession({ required: true })

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
      <div className="flex w-full items-center gap-4 dark:text-white rounded-lg h-10 relative overflow-x-auto">
        <TabsList
          className={`absolute justify-stretch inline-flex items-center whitespace-nowrap sm:justify-center sm:gap-2 ${
            session && 'border'
          }`}
        >
          {projectTabs.map(
            (tabHeader) => (
              <TabsTrigger
                style={{ fontSize: 12 }}
                value={tabHeader.id}
                key={tabHeader.id}
              >
                {tabHeader.headerComponent}
              </TabsTrigger>
            ),
            // ),
          )}
        </TabsList>
      </div>
      {projectTabs.map(
        (tab) => (
          <TabsContent value={tab.id} key={`${tab.id}-tab`}>
            {tab.component}
          </TabsContent>
        ),
        // ),
      )}
    </Tabs>
  )
}

export default ClientProjectPage
