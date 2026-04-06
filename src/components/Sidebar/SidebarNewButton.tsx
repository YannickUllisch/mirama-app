// src/components/Sidebar/SidebarNewButton.tsx
'use client'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import { Button } from '@ui/button'
import type { Session } from 'next-auth'
import HoverLink from '../HoverLink'

interface SidebarNewButtonProps {
  session: Session | null
  organizationId: string | undefined
}

const SidebarNewButton = ({
  session,
  organizationId,
}: SidebarNewButtonProps) => {
  if (!isOrgAdminOrOwner(session) || !organizationId) return null

  return (
    <HoverLink href={`/organization/${organizationId}/projects/create`}>
      <Button className="w-full justify-start gap-2 p-3">
        <span className="text-sidebar-primary">+</span>
        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
          New
        </span>
      </Button>
    </HoverLink>
  )
}

export default SidebarNewButton
