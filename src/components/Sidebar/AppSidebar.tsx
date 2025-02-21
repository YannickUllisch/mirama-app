'use client'
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
import {
  Role,
  type Project,
  type Task,
  type Team,
  type User,
} from '@prisma/client'
import type { AppMenuItem, SecondaryAppMenuItem } from '@src/lib/types'
import SidebarMainNav from './MainNav'
import SidebarProjectsNav from './ProjectsNav'
import SidebarSecondaryNav from './SecondaryNav'
import SidebarUserNav from './UserNav'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import Link from 'next/link'

const AppMenu: AppMenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/app',
    isCollapsible: false,
    roles: Object.values(Role) as Role[], // Allow all roles on Dashboard
  },
  {
    title: 'Personal',
    icon: LayoutGrid,
    isCollapsible: true,
    isActive: true,
    roles: Object.values(Role) as Role[],
    items: [
      {
        title: 'Tasks',
        href: '/app/tasks',
        roles: Object.values(Role) as Role[],
      },
      {
        title: 'Calendar',
        href: '/app/calendar',
        roles: Object.values(Role) as Role[],
      },
    ],
  },
  {
    title: 'Management',
    icon: BookAIcon,
    isCollapsible: true,
    isActive: true,
    roles: Object.values(Role) as Role[],
    items: [
      {
        title: 'Company',
        href: '/app/company',
        roles: [Role.ADMIN, Role.OWNER],
      },
      {
        title: 'Team',
        href: '/app/team',
        roles: Object.values(Role) as Role[],
      },
      {
        title: 'Finances',
        href: '/app/finances',
        roles: [Role.ADMIN, Role.OWNER],
      },
      {
        title: 'Archive',
        href: '/app/archive',
        roles: Object.values(Role) as Role[],
      },
    ],
  },
]

const _SecondaryAppMenu: SecondaryAppMenuItem[] = [
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
  projects: (Project & { tasks: Task[] })[]
  team: Team | null
  session: Session | null
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  projects,
  user,
  team,
  session,
  ...props
}) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMainNav items={AppMenu} session={session} />
        <SidebarProjectsNav
          session={session}
          projects={projects.map((p) => ({
            href: `/app/${p.name}`,
            original: p,
            isActive:
              DateTime.fromJSDate(p.startDate) <= DateTime.now() &&
              DateTime.fromJSDate(p.endDate) >= DateTime.now(),
            tasks: p.tasks,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserNav user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
