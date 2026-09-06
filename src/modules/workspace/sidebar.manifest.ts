import {
  Inbox,
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
    href: '/organization/[organizationId]/inbox',
    route: 'inbox',
  },
  {
    title: 'My Work',
    icon: SquareCheckBigIcon,
    href: '/organization/[organizationId]/tasks',
    route: 'my-work',
  },
  {
    title: 'Agent',
    icon: Sparkles,
    href: '/organization/[organizationId]/agent',
    route: 'agent',
  },
  {
    title: 'Agent',
    icon: Sparkles,
    href: '/organization/[organizationId]',
    route: '',
  },
]

export const SIDEBAR_WORKSPACE_GROUP_ITEMS: SidebarManifestItem[] = [
  {
    title: 'All Projects',
    icon: Layers2Icon,
    href: '/organization/[organizationId]/projects',
    route: 'projects',
  },
  {
    title: 'Boards',
    icon: Layers2Icon,
    href: '/organization/[organizationId]/boards/all',
    route: 'boards',
  },
  {
    title: 'Members',
    icon: UserRoundIcon,
    href: '/organization/[organizationId]/members',
    route: 'members',
  },
  {
    title: 'Teams',
    icon: UsersRoundIcon,
    href: '/organization/[organizationId]/settings/teams',
    route: 'teams',
  },
]
