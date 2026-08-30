// src/modules/tenant/settings/settingsSidebarMenu.ts

import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BookAIcon,
  Bot,
  Building2,
  CreditCardIcon,
  KeyRound,
  Link2,
  Mail,
  Palette,
  Settings2,
  ShieldCheck,
  Tag,
  User,
  Users,
  UsersRound,
} from 'lucide-react'

export type SettingsMenuItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type SettingsMenuGroup = {
  group: 'Personal' | 'Administration' | 'Workspace' | 'Projects'
  items: SettingsMenuItem[]
}

export const SettingsSidebarMenu: SettingsMenuGroup[] = [
  {
    group: 'Personal',
    items: [
      {
        label: 'Preferences',
        href: '/organization/[organizationId]/settings/account/preferences',
        icon: Settings2,
      },
      {
        label: 'Profile',
        href: '/organization/[organizationId]/settings/account/profile',
        icon: User,
      },
      {
        label: 'Notifications',
        href: '/organization/[organizationId]/settings/account/notifications',
        icon: Bell,
      },
      {
        label: 'Security & access',
        href: '/organization/[organizationId]/settings/account/security',
        icon: ShieldCheck,
      },
      {
        label: 'Connected accounts',
        href: '/organization/[organizationId]/settings/account/connected-accounts',
        icon: Link2,
      },
      {
        label: 'Agent personalization',
        href: '/organization/[organizationId]/settings/account/agent',
        icon: Bot,
      },
    ],
  },
  {
    group: 'Administration',
    items: [
      {
        label: 'General',
        href: '/organization/[organizationId]/settings/general',
        icon: Settings2,
      },
      {
        label: 'Branding',
        href: '/organization/[organizationId]/settings/branding',
        icon: Palette,
      },
      {
        label: 'Notifications',
        href: '/organization/[organizationId]/settings/notifications',
        icon: Bell,
      },
      {
        label: 'Billing',
        href: '/organization/[organizationId]/settings/billing',
        icon: CreditCardIcon,
      },
      {
        label: 'Policies',
        href: '/organization/[organizationId]/settings/policies',
        icon: BookAIcon,
      },
      {
        label: 'Roles',
        href: '/organization/[organizationId]/settings/roles',
        icon: KeyRound,
      },
      {
        label: 'Organizations',
        href: '/organization/[organizationId]/settings/organizations',
        icon: Building2,
      },
    ],
  },
  {
    group: 'Workspace',
    items: [
      {
        label: 'Members',
        href: '/organization/[organizationId]/settings/members',
        icon: Users,
      },
      {
        label: 'Teams',
        href: '/organization/[organizationId]/settings/teams',
        icon: UsersRound,
      },
      {
        label: 'Invitations',
        href: '/organization/[organizationId]/settings/invitations',
        icon: Mail,
      },
    ],
  },
  {
    group: 'Projects',
    items: [
      {
        label: 'Tags',
        href: '/organization/[organizationId]/settings/projects',
        icon: Tag,
      },
    ],
  },
]
