'use client'
import type * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
  Book,
  LayoutGrid,
  Home,
  BookAIcon,
  Bell,
  HelpCircleIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@src/components/ui/sidebar'
import { TeamSwitcher } from './ShadSidebar/team-switcher'

import { NavUser } from './ShadSidebar/nav-user'
import type { Project, User } from '@prisma/client'
import type { AppMenuItem, SecondaryAppMenuItem } from '@src/lib/constants'
import SidebarMainNav from './ShadSidebar/MainNav'
import SidebarProjectsNav from './ShadSidebar/ProjectsNav'
import SidebarSecondaryNav from './ShadSidebar/SecondaryNav'

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
  },
  {
    href: '/app',
    title: 'Support',
    icon: HelpCircleIcon,
  },
]

const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Personal',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Book,
    },
  ],
}

interface AppSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Sidebar>, 'props'> {
  user: User
  projects: Project[]
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  projects,
  user,
  ...props
}) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMainNav items={AppMenu} />
        <SidebarProjectsNav
          projects={projects.map((p) => ({
            href: `/app/${p.name}`,
            name: p.name,
          }))}
        />
        <SidebarSecondaryNav items={SecondaryAppMenu} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
