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
    href: '/[organizationSlug]/inbox',
    route: 'inbox',
  },
  {
    title: 'My Work',
    icon: SquareCheckBigIcon,
    href: '/[organizationSlug]/tasks',
    route: 'my-work',
  },
  {
    title: 'Agent',
    icon: Sparkles,
    href: '/[organizationSlug]/agent',
    route: 'agent',
  },
  {
    title: 'Dashboard',
    icon: HomeIcon,
    href: '/[organizationSlug]/',
    route: 'dashboard',
  },
]

export const SIDEBAR_WORKSPACE_GROUP_ITEMS: SidebarManifestItem[] = [
  {
    title: 'All Projects',
    icon: Layers2Icon,
    href: '/[organizationSlug]/projects',
    route: 'projects',
  },
  {
    title: 'Boards',
    icon: KanbanIcon,
    href: '/[organizationSlug]/boards/all',
    route: 'boards',
  },
  {
    title: 'Members',
    icon: UserRoundIcon,
    href: '/[organizationSlug]/members',
    route: 'members',
  },
  {
    title: 'Teams',
    icon: UsersRoundIcon,
    href: '/[organizationSlug]/settings/teams',
    route: 'teams',
  },
]
