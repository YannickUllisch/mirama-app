'use client'
import type { AppMenuItem } from '@src/types/types'
import {
  ChartNoAxesColumnIcon,
  Home,
  Inbox,
  Layers2Icon,
  SquareCheckBigIcon,
} from 'lucide-react'

export const OrganizationSidebarMenu: AppMenuItem[] = [
  {
    title: 'Inbox',
    icon: Inbox,
    href: '/organization/[organizationId]/inbox',
    isCollapsible: false,
  },
  {
    title: 'Home',
    icon: Home,
    href: '/organization/[organizationId]',
    isCollapsible: false,
  },
  {
    title: 'Dashboard',
    icon: ChartNoAxesColumnIcon,
    href: '/organization/[organizationId]/dashboard',
    isCollapsible: false,
  },
  {
    title: 'Projects',
    icon: Layers2Icon,
    href: '/organization/[organizationId]/projects',
    isCollapsible: false,
  },
  {
    title: 'My Tasks',
    icon: SquareCheckBigIcon,
    href: '/organization/[organizationId]/tasks',
    isCollapsible: false,
  },
]
