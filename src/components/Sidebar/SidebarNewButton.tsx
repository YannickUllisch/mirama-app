// src/components/Sidebar/SidebarNewButton.tsx
'use client'
import { Button } from '@ui/button'
import HoverLink from '../HoverLink'

interface SidebarNewButtonProps {
  organizationId: string | undefined
}

const SidebarNewButton = ({ organizationId }: SidebarNewButtonProps) => {
  if (!organizationId) return null

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
