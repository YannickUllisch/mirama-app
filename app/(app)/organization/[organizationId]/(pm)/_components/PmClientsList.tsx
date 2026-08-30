// app/(app)/organization/[organizationId]/(pm)/_components/PmClientsList.tsx
'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@src/components/animate-ui/components/radix/sidebar'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import PmClientNavItem from './PmClientNavItem'
import type { PmClient } from './PmClientsServer'

const PmClientsList = ({
  clients,
  organizationId,
}: {
  clients: PmClient[]
  organizationId: string
}) => {
  return (
    <SidebarGroup className="p-0 px-2">
      <SidebarGroupLabel>Your clients</SidebarGroupLabel>
      <SidebarGroupContent>
        {clients.length > 0 ? (
          <SidebarMenu>
            {clients.map((client) => (
              <PmClientNavItem
                key={client.id}
                client={client}
                organizationId={organizationId}
              />
            ))}
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
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default PmClientsList
