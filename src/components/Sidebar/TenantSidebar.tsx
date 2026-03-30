'use client'
import { TenantSidebarMenu } from '@src/core/tenant/tenantSidebarMenu'
import type { AppMenuItem } from '@src/types/types'
import type { Session } from 'next-auth'
import AppSidebar from './AppSidebar'

interface TenantSidebarProps {
  session: Session | null
  tenantId: string
  className?: string
}

const TenantSidebar = ({
  session,
  tenantId,
  className,
}: TenantSidebarProps) => {
  const injectOrgId = (items: any[]): any[] => {
    return items.map((item) => ({
      ...item,
      href: item.href ? item.href.replace('[tenantId]', tenantId) : item.href,
      items: item.items ? injectOrgId(item.items) : item.items,
    }))
  }
  const localizedMenu = injectOrgId(TenantSidebarMenu) as AppMenuItem[]

  return (
    <AppSidebar
      menuItems={localizedMenu}
      roleType="tenant"
      session={session}
      className={className}
    />
  )
}

export default TenantSidebar
