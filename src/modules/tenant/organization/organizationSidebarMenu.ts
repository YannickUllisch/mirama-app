'use client'
import type { AppMenuItem } from '@src/types/types'
import {
  ChartNoAxesColumnIcon,
  Home,
  Layers2Icon,
  SquareCheckBigIcon,
} from 'lucide-react'

export const OrganizationSidebarMenu: AppMenuItem[] = [
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
