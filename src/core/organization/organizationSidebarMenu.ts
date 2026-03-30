import { OrganizationRole } from '@prisma/client'
import type { AppMenuItem } from '@src/types/types'
import {
  BookAIcon,
  Calendar,
  ClipboardList,
  CreditCardIcon,
  Folders,
  Home,
  Users,
} from 'lucide-react'

export const OrganizationSidebarMenu: AppMenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/app',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Projects',
    icon: Folders,
    href: '/app/projects',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'My Tasks',
    icon: ClipboardList,
    href: '/app/tasks',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Calendar',
    icon: Calendar,
    href: '/app/calendar',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Finances',
    icon: CreditCardIcon,
    href: '/app/finances',
    isCollapsible: false,
    roles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  },
  {
    title: 'Teams',
    icon: Users,
    href: '/app/team',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Management',
    icon: BookAIcon,
    isCollapsible: true,
    isActive: true,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
    items: [
      {
        title: 'Company',
        href: '/app/company',
        roles: [OrganizationRole.ADMIN, OrganizationRole.OWNER],
      },
      {
        title: 'Archive',
        href: '/app/archive',
        roles: Object.values(OrganizationRole) as OrganizationRole[],
      },
    ],
  },
]
