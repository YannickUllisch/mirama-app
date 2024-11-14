'use client'
import type * as React from 'react'
import {
  LayoutGrid,
  Home,
  BookAIcon,
  Bell,
  HelpCircleIcon,
  Component,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuAction,
  SidebarRail,
} from '@src/components/ui/sidebar'
import SidebarTeamSwitcher from './TeamSwitcher'
import type { Project, Team, User } from '@prisma/client'
import type { AppMenuItem, SecondaryAppMenuItem } from '@src/lib/constants'
import SidebarMainNav from './MainNav'
import SidebarProjectsNav from './ProjectsNav'
import SidebarSecondaryNav from './SecondaryNav'
import SidebarUserNav from './UserNav'
import { DateTime } from 'luxon'

const AppMenu: AppMenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/app',
    isCollapsible: false,
  },
  {
    title: 'Personal',
    icon: LayoutGrid,
    isCollapsible: true,
    isActive: true,
    items: [
      {
        title: 'Projects',
        href: '/app/projects',
      },
      {
        title: 'Tasks',
        href: '/app/tasks',
      },
      {
        title: 'Archive',
        href: '/app/archive',
      },
    ],
  },
  {
    title: 'Management',
    icon: BookAIcon,
    isCollapsible: true,
    isActive: true,
    items: [
      {
        title: 'Team',
        href: '/app/team',
      },
      {
        title: 'Budgets',
        href: '/app/budget',
      },
    ],
  },
]

const SecondaryAppMenu: SecondaryAppMenuItem[] = [
  {
    href: '/app',
    title: 'Notifications',
    icon: Bell,
    menuAction: (
      <SidebarMenuAction showOnHover>
        <div className="text-red-500">x</div>
      </SidebarMenuAction>
    ),
  },
  {
    href: '/app',
    title: 'Support',
    icon: HelpCircleIcon,
  },
]

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'props'> {
  user: User
  projects: Project[]
  team: Team
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  projects,
  user,
  team,
  ...props
}) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTeamSwitcher
          team={{
            logo: Component,
            name: team.name,
            plan: 'Enterprise',
          }}
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMainNav items={AppMenu} />
        <SidebarProjectsNav
          projects={projects.map((p) => ({
            href: `/app/${p.name}`,
            name: p.name,
            isActive:
              DateTime.fromJSDate(p.startDate) <= DateTime.now() &&
              DateTime.fromJSDate(p.endDate) >= DateTime.now(),
          }))}
        />
        <SidebarSecondaryNav items={SecondaryAppMenu} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserNav user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
