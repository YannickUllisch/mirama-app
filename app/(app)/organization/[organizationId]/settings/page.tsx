'use client'
import { OrganizationRole } from '@prisma/client'
import PageHeader from '@src/components/PageHeader'
import AccountTab from '@src/components/Tabs/SettingTabs/AccountTab'
import InvitationsTab from '@src/components/Tabs/SettingTabs/InvitationsTab'
import TagsTab from '@src/components/Tabs/SettingTabs/TagsTab'
import { Separator } from '@src/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { Settings, Tags, User, UserCog } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type JSX, useEffect, useState } from 'react'

const ProjectPage = () => {
  const { data: session } = useSession()

  const settingsTabs: {
    roles: OrganizationRole[]
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'account',
      roles: [
        OrganizationRole.ADMIN,
        OrganizationRole.OWNER,
        OrganizationRole.FREELANCE,
        OrganizationRole.USER,
      ],
      component: <AccountTab session={session} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <User width={15} /> Account
        </div>
      ),
    },
    {
      id: 'tabs',
      roles: [OrganizationRole.ADMIN, OrganizationRole.OWNER],
      component: <TagsTab />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <Tags width={15} /> Tags
        </div>
      ),
    },
    {
      id: 'invitations',
      roles: [OrganizationRole.ADMIN, OrganizationRole.OWNER],
      component: <InvitationsTab session={session} />,
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <UserCog width={15} /> Invitations
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
      <PageHeader
        icon={Settings}
        title="Settings"
        description="General Settings"
      />
      <div className="flex items-center dark:text-white rounded-lg h-10 relative overflow-x-auto">
        <TabsList className="justify-stretch absolute flex">
          {settingsTabs.map(
            (tabHeader) =>
              session &&
              tabHeader.roles.includes(session.user.orgRole as any) && (
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
      {settingsTabs.map(
        (tab) =>
          session &&
          tab.roles.includes(session.user.orgRole as any) && (
            <TabsContent className="px-10" value={tab.id} key={`${tab.id}-tab`}>
              {tab.component}
            </TabsContent>
          ),
      )}
    </Tabs>
  )
}

export default ProjectPage
