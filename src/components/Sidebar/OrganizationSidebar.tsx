// src/components/Sidebar/OrganizationSidebar.tsx
'use client'
import { cn } from '@src/lib/utils'
import { OrganizationSidebarMenu } from '@src/modules/tenant/organization/organizationSidebarMenu'
import type { AppMenuItem } from '@src/types/types'
import { SidebarSeparator } from '@ui/sidebar'
import { useSession } from 'next-auth/react'
import AppSidebar from './AppSidebar'
import SidebarMainNav from './MainNav'
import SidebarNewButton from './SidebarNewButton'

interface OrganizationSidebarProps {
  organizationId: string
  tenantId: string
  className?: string
  projectsSlot?: React.ReactNode
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
  tenantId,
  organizationId,
  projectsSlot,
}: OrganizationSidebarProps) => {
  const { data: session } = useSession()
  const localizedMenu = injectOrgId(OrganizationSidebarMenu, organizationId)
  const currentRole = session?.user?.orgRole

  return (
    <AppSidebar
      className={cn('portal-accent-forest', className)}
      tenantId={tenantId}
      organizationId={organizationId}
      headerSlot={
        <SidebarNewButton organizationId={session?.user.organizationId} />
      }
    >
      <SidebarMainNav items={localizedMenu} userRole={currentRole} />
      <SidebarSeparator />
      {projectsSlot}
      <SidebarSeparator />
    </AppSidebar>
  )
}

export default OrganizationSidebar
