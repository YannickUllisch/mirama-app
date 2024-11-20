'use client'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@src/components/ui/sidebar'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import Link from 'next/link'
import AddProjectDialog from '@src/components/Dialogs/AddProjectDialog'
import { ChevronRight, Ellipsis, PlusSquare } from 'lucide-react'
import type { Task } from '@prisma/client'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible'

const SidebarProjectsNav = ({
  projects,
  session,
  onRouteChange,
}: {
  projects: {
    name: string
    href: string
    isActive: boolean
    tasks: Task[]
  }[]
  session: Session | null
  onRouteChange: () => void
}) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <div className="flex w-full justify-between items-center">
          <span>Projects</span>
          {isTeamAdminOrOwner(session) && (
            <AddProjectDialog
              key={'Project Dialog'}
              button={
                <PlusSquare className="w-4 cursor-pointer hover:text-white" />
              }
            />
          )}
        </div>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem key={item.name}>
              <div className="flex items-center gap-1">
                <CollapsibleTrigger>
                  <ChevronRight
                    width={14}
                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </CollapsibleTrigger>

                <SidebarMenuButton asChild>
                  <div className="flex items-center">
                    <Link
                      prefetch
                      href={item.href}
                      onClick={onRouteChange}
                      onKeyUp={onRouteChange}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </div>
                </SidebarMenuButton>
              </div>
              {isTeamAdminOrOwner(session) && (
                <SidebarMenuAction showOnHover>
                  <Ellipsis />
                </SidebarMenuAction>
              )}
              <div>{item.isActive}</div>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.tasks?.map((task) => (
                    <SidebarMenuSubItem
                      key={`${task.title}-${task.dateCreated}`}
                    >
                      <SidebarMenuSubButton
                        asChild
                        className="flex justify-between"
                      >
                        <Link
                          href={`/app/${item.name}/edit/${task.id}`}
                          onClick={onRouteChange}
                          onKeyUp={onRouteChange}
                          className="flex justify-between items-center w-full"
                        >
                          <span className="truncate max-w-[calc(100%-1rem)] text-ellipsis overflow-hidden whitespace-nowrap">
                            {task.title}
                          </span>
                          <div
                            className={`rounded-full w-2 h-2 ${
                              task.assignedToId === session?.user.id
                                ? 'bg-green-500'
                                : 'invisible'
                            }`}
                          />
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default SidebarProjectsNav
