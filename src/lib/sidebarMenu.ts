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

export const AppMenu: AppMenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/app',
    isCollapsible: false,
    roles: Object.values(Role) as Role[],
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
  {
    title: 'Calendar',
    icon: Calendar,
    href: '/app/calendar',
    isCollapsible: false,
    roles: Object.values(Role) as Role[],
  },
  {
    title: 'Finances',
    icon: CreditCardIcon,
    href: '/app/finances',
    isCollapsible: false,
    roles: [Role.OWNER, Role.ADMIN],
  },
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
      {
        title: 'Archive',
        href: '/app/archive',
        roles: Object.values(Role) as Role[],
      },
    ],
  },
]
