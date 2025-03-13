'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Folder, FolderOpen, List, PlusSquare } from 'lucide-react'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui/collapsible'
import { Button } from '@ui/button'
import { cn } from '@src/lib/utils'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Project, Task } from '@prisma/client'
import type { Session } from 'next-auth'
import AddProjectDialog from '../Dialogs/AddProjectDialog'

interface ProjectsNavProps {
  projects: {
    href: string
    original: Project
    isActive: boolean
    tasks: Task[]
  }[]
  session: Session | null
}

export function ProjectsNav({ projects, session }: ProjectsNavProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const pathname = usePathname()

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0 px-2">
        <div className="flex items-center justify-between px-2 py-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  !isOpen && '-rotate-90',
                )}
              />
              <span className="ml-2 text-text/80">Projects</span>
            </Button>
          </CollapsibleTrigger>
          <div className="flex items-center gap-1">
            {isTeamAdminOrOwner(session) && (
              <AddProjectDialog
                key="Project Dialog"
                button={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-accent"
                  >
                    <PlusSquare className="h-4 w-4" />
                    <span className="sr-only">Add project</span>
                  </Button>
                }
              />
            )}
          </div>
        </div>
        <CollapsibleContent>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.href}>
                <div className="flex items-center w-full gap-2 px-2">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'flex-1 justify-between',
                      pathname?.includes(project.original.name) && 'bg-accent',
                    )}
                  >
                    <Link prefetch={false} href={project.href}>
                      <div className="flex gap-2 items-center">
                        <FolderOpen size={14} className="h-4 w-4 mr-1" />
                        <span className="truncate">
                          {project.original.name}
                        </span>
                      </div>
                      {project.isActive && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {project.tasks.length}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
