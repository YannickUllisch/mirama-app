'use client'
import { Role, type User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { Grid2x2, Home, TableProperties } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Separator } from '@src/components/ui/separator'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { LoadBarPulse } from '@src/components/Loading/LoadBarPulse'
import GridTab from '@src/components/Tabs/DashboardTabs/GridTab'
import TableTab from '@src/components/Tabs/DashboardTabs/TableTab'

const ClientProjectPage = () => {
  // Session
  const { data: session } = useSession({ required: true })

  // States
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  const { data: users } = useSWR<User[]>('/api/db/team/member')

  const onRouteChange = () => {
    if (!pageLoading) {
      setPageLoading(true)
    }
  }

  // Tab definitions
  const dashboardTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'grid',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <GridTab onRouteChange={onRouteChange} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <Grid2x2 width={15} /> Grid
        </div>
      ),
    },
    {
      id: 'table',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: (
        <TableTab
          session={session}
          users={users ?? []}
          onRouteChange={onRouteChange}
        />
      ),
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <TableProperties width={15} /> Table
        </div>
      ),
    },
  ]
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')
  const [tab, setTab] = useState(currentTab ?? 'grid')

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
      <div className="flex items-center gap-4 dark:text-white mb-2 rounded-lg p-1 w-fit">
        <TabsList className="justify-center">
          {dashboardTabs.map(
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
      {dashboardTabs.map(
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
