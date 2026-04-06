// src/components/Sidebar/OrganizationSidebar.tsx
'use client'
import SidebarProjectsSkeleton from '@src/components/Skeletons/SidebarProjectsSkeleton'
import { OrganizationSidebarMenu } from '@src/modules/organization/organizationSidebarMenu'
import type { AppMenuItem } from '@src/types/types'
import { useSession } from 'next-auth/react'
import { Suspense } from 'react'
import AppSidebar from './AppSidebar'
import SidebarMainNav from './MainNav'
import RecentsNav from './RecentsNav'
import SidebarMobileHeader from './SidebarMobileHeader'
import SidebarNewButton from './SidebarNewButton'

interface OrganizationSidebarProps {
  organizationId: string
  className?: string
}

const injectOrgId = (
  items: AppMenuItem[],
  organizationId: string,
): AppMenuItem[] => {
  return items.map((item) => ({
    ...item,
    href: item.href?.replace('[organizationId]', organizationId),
    items: item.items?.map((sub) => ({
      ...sub,
      href: sub.href.replace('[organizationId]', organizationId),
    })),
  }))
}

const OrganizationSidebar = ({
  className,
  organizationId,
}: OrganizationSidebarProps) => {
  const { data: session } = useSession()
  const localizedMenu = injectOrgId(OrganizationSidebarMenu, organizationId)
  const currentRole = session?.user?.orgRole

  return (
    <AppSidebar
      className={className}
      headerSlot={
        <>
          <SidebarMobileHeader />
          <SidebarNewButton
            session={session ?? null}
            organizationId={session?.user.organizationId}
          />
        </>
      }
    >
      <SidebarMainNav items={localizedMenu} userRole={currentRole} />
      <Suspense fallback={<SidebarProjectsSkeleton />}>
        <RecentsNav />
      </Suspense>
    </AppSidebar>
  )
}

export default OrganizationSidebar
