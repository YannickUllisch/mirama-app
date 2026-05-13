// src/components/Sidebar/RecentsNav.tsx
'use client'
import apiRequest from '@hooks'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'
import { Spinner } from '@ui/spinner'
import { FolderOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'
import HoverLink from '../HoverLink'

const RecentsNav = () => {
  const pathname = usePathname()
  const { data: projects, isLoading } = apiRequest.project.fetchAll.useQuery()

  return (
    <SidebarGroup className="p-0 px-2">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-25">
          <Spinner size="sm" className="bg-sidebar-primary" />
        </div>
      ) : null}
      {projects?.length && projects.length > 0 ? (
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
      ) : null}

      <SidebarMenu>
        {projects?.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes(item.name)}
              tooltip={item.name}
              className="relative justify-between data-[active=true]:bg-sidebar-primary/10 data-[active=true]:text-sidebar-primary data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1 data-[active=true]:before:bottom-1 data-[active=true]:before:w-0.5 data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:rounded-full"
            >
              <div className="flex items-center gap-2">
                <HoverLink
                  href={`/app/projects/${item.name}`}
                  className="flex items-center gap-2"
                >
                  <FolderOpen strokeWidth={1.5} className="size-4" />
                  <span>{item.name}</span>
                </HoverLink>
                <span className="ml-2 text-xs text-sidebar-foreground/50">
                  {item.tasks.length}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default RecentsNav
