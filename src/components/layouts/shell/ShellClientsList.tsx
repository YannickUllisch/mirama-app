'use client'

import { SidebarMenu } from '@src/components/ui/sidebar'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import type { ClientSummary } from '@src/modules/workspace/viewstate.types'
import { Building2, Plus } from 'lucide-react'
import ShellClientNavItem from './ShellClientNavItem'
import ShellSidebarCollapsibleGroup from './ShellSidebarCollapsibleGroup'
import ShellSidebarMore from './ShellSidebarMore'
import OrgLink from '@src/components/OrgLink'

const VISIBLE_LIMIT = 3

// "Your clients" is always the org's live client list (never stored, never
// personalizable) - it just renders whatever IClientService returns, in that order.
const ShellClientsList = ({ clients }: { clients: ClientSummary[] }) => {
  const { activeOrganizationSlug } = useOrganizationResource()
  const shown = clients.slice(0, VISIBLE_LIMIT)
  const overflow = clients.slice(VISIBLE_LIMIT)

  return (
    <ShellSidebarCollapsibleGroup
      label="Your clients"
      action={{
        href: `/${activeOrganizationSlug}/clients/create`,
        label: 'New client',
      }}
    >
      {clients.length > 0 ? (
        <SidebarMenu>
          {shown.map((client) => (
            <ShellClientNavItem key={client.clientId} client={client} />
          ))}
          <ShellSidebarMore
            items={overflow.map((client) => ({
              key: client.clientId,
              icon: <Building2 className="size-3.5 shrink-0" />,
              label: client.name,
              href: `/${activeOrganizationSlug}/clients/${client.clientId}`,
            }))}
          />
        </SidebarMenu>
      ) : (
        <OrgLink
          href="/clients/create"
          className="flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs text-body-text/60 transition-colors hover:bg-sidebar-accent hover:text-ink group-data-[collapsible=icon]:hidden"
        >
          <Plus className="size-3 shrink-0" />
          New client
        </OrgLink>
      )}
    </ShellSidebarCollapsibleGroup>
  )
}

export default ShellClientsList
