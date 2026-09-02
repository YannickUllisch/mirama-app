'use client'

import {
  SidebarMenu,
  SidebarMenuItem,
} from '@src/components/animate-ui/components/radix/sidebar'
import { OrganizationWorkspaceMenu } from '@src/modules/tenant/organization/organizationSidebarMenu'
import PmNavLink from './PmNavLink'
import PmSidebarCollapsibleGroup from './PmSidebarCollapsibleGroup'

const PmWorkspaceMenu = ({ organizationId }: { organizationId: string }) => {
  return (
    <PmSidebarCollapsibleGroup label="Workspace">
      <SidebarMenu>
        {OrganizationWorkspaceMenu.map((item) => (
          <SidebarMenuItem key={item.title}>
            <PmNavLink
              href={(item.href ?? '#').replace(
                '[organizationId]',
                organizationId,
              )}
              label={item.title}
              icon={<item.icon className="w-3.5 h-3.5 shrink-0" />}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </PmSidebarCollapsibleGroup>
  )
}

export default PmWorkspaceMenu
