'use client'
import { Role, type User } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { Grid2x2, TableProperties } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import GridTab from '@src/components/Tabs/DashboardTabs/GridTab'
import TableTab from '@src/components/Tabs/DashboardTabs/TableTab'
import Loading from '../../loading'

const ClientProjectPage = () => {
  // Session
  const { data: session } = useSession({ required: true })

  const { data: users } = useSWR<User[]>('team/member')

  // Tab definitions
  const dashboardTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = useMemo(
    () => [
      {
        id: 'grid',
        roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
        component: <GridTab />,
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <Grid2x2 width={15} /> Grid
          </div>
        ),
      },
      {
        id: 'table',
        roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
        component: <TableTab session={session} users={users ?? []} />,
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <TableProperties width={15} /> Table
          </div>
        ),
      },
    ],
    [session, users],
  )
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

  if (!session) {
    return <Loading />
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="flex items-center gap-4 dark:text-white mb-2 rounded-lg p-1 w-fit">
        <TabsList
          className={`inline-flex items-center justify-start whitespace-nowrap sm:justify-center sm:gap-2 ${
            session && 'border'
          }`}
        >
          {dashboardTabs.map((tabHeader) => (
            <TabsTrigger
              style={{ fontSize: 12 }}
              value={tabHeader.id}
              key={tabHeader.id}
            >
              {tabHeader.headerComponent}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {dashboardTabs.map((tab) => (
        <TabsContent value={tab.id} key={`${tab.id}-tab`}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default ClientProjectPage
