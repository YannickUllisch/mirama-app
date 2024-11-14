'use client'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@src/components/ui/sidebar'
import Link from 'next/link'

const SidebarProjectsNav = ({
  projects,
}: {
  projects: {
    name: string
    href: string
    isActive: boolean
  }[]
}) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.href}>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover>
              <div
                className={`rounded-full w-2 h-2 ${
                  item.isActive ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
            </SidebarMenuAction>
            <div>{item.isActive}</div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default SidebarProjectsNav
