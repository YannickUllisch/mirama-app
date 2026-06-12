// src/components/Sidebar/SidebarProjectsList.tsx
'use client'

import { usePermissions } from '@src/modules/tenant/iam/PermissionContext'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'
import { ChevronDown, FolderOpen, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import HoverLink from '../HoverLink'
import type { SidebarProject } from './SidebarProjectsServer'

const PAGE_SIZE = 10

const SidebarProjectsList = ({
  projects,
  organizationId,
}: {
  projects: SidebarProject[]
  organizationId: string
}) => {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [open, setOpen] = useState(true)
  const { can } = usePermissions()
  const pathname = usePathname()

  if (projects.length === 0) return null

  const canCreate = can('project', 'create')
  const shown = projects.slice(0, visible)
  const remaining = Math.min(PAGE_SIZE, projects.length - visible)
  const hasMore = visible < projects.length

  return (
    <SidebarGroup className="p-0 px-2">
      <SidebarGroupLabel asChild>
        <div className="flex w-full items-center justify-between">
          <span>Projects</span>
          <div className="flex items-center gap-0.5">
            {canCreate && (
              <Link
                href={`/organization/${organizationId}/projects/create`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                aria-label="New project"
              >
                <Plus className="size-3.5" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              aria-label={open ? 'Collapse projects' : 'Expand projects'}
            >
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
              />
            </button>
          </div>
        </div>
      </SidebarGroupLabel>

      {open && (
        <SidebarGroupContent>
          <SidebarMenu>
            {shown.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes(`/projects/${item.name}`)}
                  tooltip={item.name}
                  className="relative data-[active=true]:bg-transparent data-[active=true]:hover:bg-primary data-[active=true]:hover:text-sidebar-accent-foreground data-[active=true]:text-sidebar-foreground data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-0 data-[active=true]:before:bottom-0 data-[active=true]:before:w-1 data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:rounded-r"
                >
                  <HoverLink
                    href={`/organization/${organizationId}/projects/${item.name}`}
                    className="flex items-center gap-2 w-full"
                  >
                    <FolderOpen strokeWidth={1.5} className="size-4 shrink-0" />
                    <span className="truncate flex-1">{item.name}</span>
                    {item.taskCount > 0 && (
                      <span className="text-xs text-sidebar-foreground/50 shrink-0 tabular-nums">
                        {item.taskCount}
                      </span>
                    )}
                  </HoverLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {hasMore && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="text-sidebar-foreground/50 hover:text-sidebar-foreground text-xs justify-center"
                >
                  Show {remaining} more
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  )
}

export default SidebarProjectsList
