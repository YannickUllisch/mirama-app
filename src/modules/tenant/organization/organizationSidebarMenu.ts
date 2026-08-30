'use client'
import type { AppMenuItem } from '@src/types/types'
import {
  ChartNoAxesColumnIcon,
  Inbox,
  Layers2Icon,
  Sparkles,
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
    title: 'My Work',
    icon: SquareCheckBigIcon,
    href: '/organization/[organizationId]/tasks',
    isCollapsible: false,
  },
  {
    title: 'Agent',
    icon: Sparkles,
    href: '/organization/[organizationId]/agent',
    isCollapsible: false,
  },
  {
    title: 'Projects',
    icon: Layers2Icon,
    href: '/organization/[organizationId]/projects',
    isCollapsible: false,
  },

  {
    title: 'Dashboard',
    icon: ChartNoAxesColumnIcon,
    href: '/organization/[organizationId]',
    isCollapsible: false,
  },
]
