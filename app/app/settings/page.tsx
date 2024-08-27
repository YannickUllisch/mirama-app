'use client'
import { Role } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { useSession } from 'next-auth/react'
import { Settings, Tags, User } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import AccountTab from '@src/components/SettingTabs/AccountTab'
import TagsTab from '@src/components/SettingTabs/TagsTab'
import { Separator } from '@src/components/ui/separator'

const ProjectPage = () => {
  const { data: session } = useSession()

  const settingsTabs: {
    roles: Role[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'account',
      roles: [Role.ADMIN, Role.OWNER, Role.FREELANCE, Role.USER],
      component: <AccountTab session={session} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <User width={15} /> Account
        </div>
      ),
    },
    {
      id: 'tabs',
      roles: [Role.ADMIN, Role.OWNER],
      component: <TagsTab />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <Tags width={15} /> Tags
        </div>
      ),
    },
  ]

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  const [tab, setTab] = useState(currentTab ?? 'account')

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
        <Settings strokeWidth={1.5} width={20} />
        <span style={{ fontSize: 20 }}>Settings</span>
        <span>|</span>
        <TabsList className="justify-start flex">
          {settingsTabs.map(
            (tabHeader) =>
              session &&
              tabHeader.roles.includes(session.user.role) && (
                <TabsTrigger
                  // className="bg-neutral-700"
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
      {settingsTabs.map(
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

export default ProjectPage
