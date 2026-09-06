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
        href: '/organization/[organizationSlug]/settings/account/preferences',
        icon: Settings2,
      },
      {
        label: 'Profile',
        href: '/organization/[organizationSlug]/settings/account/profile',
        icon: User,
      },
      {
        label: 'Notifications',
        href: '/organization/[organizationSlug]/settings/account/notifications',
        icon: Bell,
      },
      {
        label: 'Security & access',
        href: '/organization/[organizationSlug]/settings/account/security',
        icon: ShieldCheck,
      },
      {
        label: 'Connected accounts',
        href: '/organization/[organizationSlug]/settings/account/connected-accounts',
        icon: Link2,
      },
      {
        label: 'Agent personalization',
        href: '/organization/[organizationSlug]/settings/account/agent',
        icon: Bot,
      },
    ],
  },
  {
    group: 'Administration',
    items: [
      {
        label: 'General',
        href: '/organization/[organizationSlug]/settings/general',
        icon: Settings2,
      },
      {
        label: 'Branding',
        href: '/organization/[organizationSlug]/settings/branding',
        icon: Palette,
      },
      {
        label: 'Notifications',
        href: '/organization/[organizationSlug]/settings/notifications',
        icon: Bell,
      },
      {
        label: 'Billing',
        href: '/organization/[organizationSlug]/settings/billing',
        icon: CreditCardIcon,
      },
      {
        label: 'Policies',
        href: '/organization/[organizationSlug]/settings/policies',
        icon: BookAIcon,
      },
      {
        label: 'Roles',
        href: '/organization/[organizationSlug]/settings/roles',
        icon: KeyRound,
      },
      {
        label: 'Organizations',
        href: '/organization/[organizationSlug]/settings/organizations',
        icon: Building2,
      },
    ],
  },
  {
    group: 'Workspace',
    items: [
      {
        label: 'Members',
        href: '/organization/[organizationSlug]/settings/members',
        icon: Users,
      },
      {
        label: 'Teams',
        href: '/organization/[organizationSlug]/settings/teams',
        icon: UsersRound,
      },
      {
        label: 'Invitations',
        href: '/organization/[organizationSlug]/settings/invitations',
        icon: Mail,
      },
    ],
  },
  {
    group: 'Projects',
    items: [
      {
        label: 'Tags',
        href: '/organization/[organizationSlug]/settings/projects',
        icon: Tag,
      },
    ],
  },
]
