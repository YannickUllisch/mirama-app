'use client'
import { OrganizationSidebarMenu } from '@src/modules/organization/organizationSidebarMenu'
import type { AppMenuItem } from '@src/types/types'
import type { Session } from 'next-auth'
import AppSidebar from './AppSidebar'

interface OrganizationSidebarProps {
  session: Session | null
  organizationId: string
  className?: string
}

const OrganizationSidebar = ({
  session,
  className,
  organizationId,
}: OrganizationSidebarProps) => {
  const injectOrgId = (items: any[]): any[] => {
    return items.map((item) => ({
      ...item,
      href: item.href
        ? item.href.replace('[organizationId]', organizationId)
        : item.href,
      items: item.items ? injectOrgId(item.items) : item.items,
    }))
  }
  const localizedMenu = injectOrgId(OrganizationSidebarMenu) as AppMenuItem[]

  return (
    <AppSidebar
      menuItems={localizedMenu}
      roleType="org"
      session={session}
      className={className}
    />
  )
}

export default OrganizationSidebar
