'use client'

import { SidebarMenu } from '@src/components/animate-ui/components/radix/sidebar'
import type { ClientSummary } from '@src/modules/workspace/viewstate.types'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import PmClientNavItem from './PmClientNavItem'
import PmSidebarCollapsibleGroup from './PmSidebarCollapsibleGroup'
import PmSidebarMore from './PmSidebarMore'

const VISIBLE_LIMIT = 3

// "Your clients" is always the org's live client list (never stored, never
// personalizable) - it just renders whatever IClientService returns, in that order.
const PmClientsList = ({
  clients,
  organizationId,
}: {
  clients: ClientSummary[]
  organizationId: string
}) => {
  const shown = clients.slice(0, VISIBLE_LIMIT)
  const overflow = clients.slice(VISIBLE_LIMIT)

  return (
    <PmSidebarCollapsibleGroup
      label="Your clients"
      action={{
        href: `/organization/${organizationId}/clients/create`,
        label: 'New client',
      }}
    >
      {clients.length > 0 ? (
        <SidebarMenu>
          {shown.map((client) => (
            <PmClientNavItem
              key={client.clientId}
              client={client}
              organizationId={organizationId}
            />
          ))}
          <PmSidebarMore
            items={overflow.map((client) => ({
              key: client.clientId,
              icon: <Building2 className="size-3.5 shrink-0" />,
              label: client.name,
              href: `/organization/${organizationId}/clients/${client.clientId}`,
            }))}
          />
        </SidebarMenu>
      ) : (
        <Link
          href={`/organization/${organizationId}/clients/create`}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs text-body-text/60 transition-colors hover:bg-sidebar-accent hover:text-ink group-data-[collapsible=icon]:hidden"
        >
          <Plus className="size-3 shrink-0" />
          New client
        </Link>
      )}
    </PmSidebarCollapsibleGroup>
  )
}

export default PmClientsList
