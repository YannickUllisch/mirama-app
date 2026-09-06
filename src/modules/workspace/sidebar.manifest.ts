import {
  HomeIcon,
  Inbox,
  KanbanIcon,
  Layers2Icon,
  type LucideIcon,
  Sparkles,
  SquareCheckBigIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react'
import type { ManifestRouteEntry } from './sidebar'

export type SidebarManifestItem = ManifestRouteEntry<{
  title: string
  href: string
  icon: LucideIcon
}>

// Ungrouped top-level items.
export const SIDEBAR_ITEMS: SidebarManifestItem[] = [
  {
    title: 'Inbox',
    icon: Inbox,
    href: '/organization/[organizationSlug]/inbox',
    route: 'inbox',
  },
  {
    title: 'My Work',
    icon: SquareCheckBigIcon,
    href: '/organization/[organizationSlug]/tasks',
    route: 'my-work',
  },
  {
    title: 'Agent',
    icon: Sparkles,
    href: '/organization/[organizationSlug]/agent',
    route: 'agent',
  },
  {
    title: 'Dashboard',
    icon: HomeIcon,
    href: '/organization/[organizationSlug]/',
    route: 'dashboard',
  },
]

export const SIDEBAR_WORKSPACE_GROUP_ITEMS: SidebarManifestItem[] = [
  {
    title: 'All Projects',
    icon: Layers2Icon,
    href: '/organization/[organizationSlug]/projects',
    route: 'projects',
  },
  {
    title: 'Boards',
    icon: KanbanIcon,
    href: '/organization/[organizationSlug]/boards/all',
    route: 'boards',
  },
  {
    title: 'Members',
    icon: UserRoundIcon,
    href: '/organization/[organizationSlug]/members',
    route: 'members',
  },
  {
    title: 'Teams',
    icon: UsersRoundIcon,
    href: '/organization/[organizationSlug]/settings/teams',
    route: 'teams',
  },
]
