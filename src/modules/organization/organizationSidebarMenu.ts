'use client'
import type { AppMenuItem } from '@src/types/types'
import {
  BookAIcon,
  ClipboardList,
  CreditCardIcon,
  Folders,
  Home,
} from 'lucide-react'

export const OrganizationSidebarMenu: AppMenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/organization/[organizationId]',
    isCollapsible: false,
  },
  {
    title: 'Projects',
    icon: Folders,
    href: '/organization/[organizationId]/projects',
    isCollapsible: false,
  },
  {
    title: 'My Tasks',
    icon: ClipboardList,
    href: '/organization/[organizationId]/tasks',
    isCollapsible: false,
  },
  {
    title: 'Finances',
    icon: CreditCardIcon,
    href: '/organization/[organizationId]/finances',
    isCollapsible: false,
  },

  {
    title: 'Management',
    icon: BookAIcon,
    isCollapsible: true,
    isActive: true,
    items: [
      {
        title: 'Members',
        href: '/organization/[organizationId]/members',
      },
      {
        title: 'Teams',
        href: '/organization/[organizationId]/teams',
      },
      {
        title: 'Archive',
        href: '/organization/[organizationId]/archive',
      },
    ],
  },
]
