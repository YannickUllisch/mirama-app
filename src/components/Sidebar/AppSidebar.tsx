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
import type { Project, Task, Team, User } from '@prisma/client'
import type { AppMenuItem, SecondaryAppMenuItem } from '@src/lib/constants'
import SidebarMainNav from './MainNav'
import SidebarProjectsNav from './ProjectsNav'
import SidebarSecondaryNav from './SecondaryNav'
import SidebarUserNav from './UserNav'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import { LoadBarPulse } from '../Loading/LoadBarPulse'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const AppMenu: AppMenuItem[] = [
  {
    title: 'Dashboard',
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
        title: 'Calendar',
        href: '/app/calendar',
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
        title: 'Company',
        href: '/app/company',
      },
      {
        title: 'Team',
        href: '/app/team',
      },
      {
        title: 'Budgets',
        href: '/app/budget',
      },
      {
        title: 'Archive',
        href: '/app/archive',
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
  const updatedPath = usePathname()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [currentPath, setCurrentPath] = useState<string>(updatedPath)

  useEffect(() => {
    if (updatedPath !== currentPath && pageLoading) {
      setCurrentPath(updatedPath)
      setPageLoading(false)
    }
  }, [currentPath, pageLoading, updatedPath])

  const onRouteChange = () => {
    if (!pageLoading) {
      setPageLoading(true)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {pageLoading && <LoadBarPulse />}
      <SidebarHeader>
        <SidebarTeamSwitcher
          team={{
            logo: Component,
            name: team?.name ?? 'No Team',
            plan: 'Enterprise',
          }}
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMainNav items={AppMenu} onRouteChange={onRouteChange} />
        <SidebarProjectsNav
          onRouteChange={onRouteChange}
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
