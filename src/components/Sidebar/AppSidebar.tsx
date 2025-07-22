'use client'
import {
  type Project,
  Role,
  type Task,
  type Team,
  type User,
} from '@prisma/client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuAction,
  SidebarRail,
} from '@src/components/ui/sidebar'
import type { AppMenuItem, SecondaryAppMenuItem } from '@src/types/types'
import {
  Bell,
  BookAIcon,
  Calendar,
  ClipboardList,
  Folders,
  HelpCircleIcon,
  Home,
  Users,
} from 'lucide-react'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import FavoritesNav from './FavouritesNav'
import SidebarMainNav from './MainNav'
import { ProjectsNav } from './ProjectsNav'
import SelfSidebarHeader from './SidebarHeader'
import SidebarUserNav from './UserNav'

const AppMenu: AppMenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/app',
    isCollapsible: false,
    roles: Object.values(Role) as Role[], // Allow all roles on Dashboard
  },
  {
    title: 'Projects',
    icon: Folders,
    href: '/app/projects',
    isCollapsible: false,
    roles: Object.values(Role) as Role[],
  },
  {
    title: 'My Tasks',
    icon: ClipboardList,
    href: '/app/tasks',
    isCollapsible: false,
    roles: Object.values(Role) as Role[],
  },
  // {
  //   title: 'Calendar',
  //   icon: Calendar,
  //   href: '/app/calendar',
  //   isCollapsible: false,
  //   roles: Object.values(Role) as Role[],
  // },
  {
    title: 'Teams',
    icon: Users,
    href: '/app/team',
    isCollapsible: false,
    roles: Object.values(Role) as Role[],
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
      // {
      //   title: 'Finances',
      //   href: '/app/finances',
      //   roles: [Role.ADMIN, Role.OWNER],
      // },
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
        <SelfSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMainNav items={AppMenu} session={session} />
        <FavoritesNav />
        <ProjectsNav
          session={session}
          projects={projects.map((p) => ({
            href: `/app/projects/${p.name}`,
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
