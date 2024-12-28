'use client'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@src/components/ui/sidebar'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import Link from 'next/link'
import AddProjectDialog from '@src/components/Dialogs/AddProjectDialog'
import { ChevronRight, PlusSquare } from 'lucide-react'
import type { Project, Task } from '@prisma/client'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible'

const SidebarProjectsNav = ({
  projects,
  session,
}: {
  projects: {
    href: string
    original: Project
    isActive: boolean
    tasks: Task[]
  }[]
  session: Session | null
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
            key={item.original.name}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem key={item.original.name}>
              <div className="flex items-center gap-1">
                <CollapsibleTrigger>
                  <ChevronRight
                    width={14}
                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </CollapsibleTrigger>

                <SidebarMenuButton asChild>
                  <Link prefetch={false} href={item.href}>
                    <span>{item.original.name}</span>
                  </Link>
                </SidebarMenuButton>
              </div>

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
                          href={`/app/${item.original.name}/edit/${task.id}`}
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
