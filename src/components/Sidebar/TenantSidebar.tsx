// src/components/Sidebar/TenantSidebar.tsx
'use client'
import { TenantSidebarMenu } from '@src/modules/tenant/tenantSidebarMenu'
import type { AppMenuItem } from '@src/types/types'
import AppSidebar from './AppSidebar'
import SidebarMainNav from './MainNav'
import SidebarMobileHeader from './SidebarMobileHeader'

interface TenantSidebarProps {
  tenantId: string
  className?: string
}

const buildTenantMenu = (tenantId: string): AppMenuItem[] => {
  return TenantSidebarMenu.map((item) => ({
    ...item,
    roles: undefined,
    href: item.href?.replace('[tenantId]', tenantId),
    items: item.items?.map((sub) => ({
      ...sub,
      roles: undefined,
      href: sub.href.replace('[tenantId]', tenantId),
    })),
  }))
}

const TenantSidebar = ({ tenantId, className }: TenantSidebarProps) => {
  const localizedMenu = buildTenantMenu(tenantId)

  return (
    <AppSidebar className={className} headerSlot={<SidebarMobileHeader />}>
      <SidebarMainNav items={localizedMenu} />
    </AppSidebar>
  )
}

export default TenantSidebar
