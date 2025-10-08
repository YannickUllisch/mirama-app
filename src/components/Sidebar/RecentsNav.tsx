'use client'
import apiRequest from '@hooks/query'
import type {} from '@prisma/client'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'
import { Spinner } from '@ui/spinner'
import { FolderOpen } from 'lucide-react'
import Link from 'next/link'

const RecentsNav = ({ pathname }: { pathname: string }) => {
  // Fetching recently accesses projects via LocalStorage
  // const [recentProjectIds, _setRecentProjectIds] = useLocalStorage<string[]>(
  //   'recentProjectIds',
  //   [],
  // )

  // Hooks
  const { data: projects, isLoading } = apiRequest.project.fetchAll.useQuery()

  // const recents = useMemo(() => {
  //   if (recentProjectIds.length > 0 && projects) {
  //     return projects?.filter((p) => recentProjectIds.includes(p.id))
  //   }
  //   return []
  // }, [projects, recentProjectIds])

  return (
    <SidebarGroup className="p-0 px-2">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[100px]">
          <Spinner size="sm" className="bg-black dark:bg-white" />
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
              className="relative justify-between data-[active=true]:bg-transparent data-[active=true]:hover:bg-primary data-[active=true]:hover:text-sidebar-accent-foreground data-[active=true]:text-sidebar-foreground data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-0 data-[active=true]:before:bottom-0 data-[active=true]:before:w-1 data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:rounded-r"
            >
              <div className="flex items-center gap-2">
                <Link
                  href={`/app/projects/${item.name}`}
                  className="flex items-center gap-2"
                >
                  <FolderOpen strokeWidth={1.5} className="size-4" />
                  <span>{item.name}</span>
                </Link>
                <span className="ml-2 text-xs text-sidebar-foreground">
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
