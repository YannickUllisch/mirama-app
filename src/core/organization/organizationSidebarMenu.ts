'use client'
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
    href: '/organization/[organizationId]',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Projects',
    icon: Folders,
    href: '/organization/[organizationId]/projects',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'My Tasks',
    icon: ClipboardList,
    href: '/organization/[organizationId]/tasks',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Calendar',
    icon: Calendar,
    href: '/organization/[organizationId]/calendar',
    isCollapsible: false,
    roles: Object.values(OrganizationRole) as OrganizationRole[],
  },
  {
    title: 'Finances',
    icon: CreditCardIcon,
    href: '/organization/[organizationId]/finances',
    isCollapsible: false,
    roles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  },
  {
    title: 'Teams',
    icon: Users,
    href: '/organization/[organizationId]/team',
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
        href: '/organization/[organizationId]/company',
        roles: [OrganizationRole.ADMIN, OrganizationRole.OWNER],
      },
      {
        title: 'Archive',
        href: '/organization/[organizationId]/archive',
        roles: Object.values(OrganizationRole) as OrganizationRole[],
      },
    ],
  },
]
