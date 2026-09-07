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
        href: '/[organizationSlug]/settings/account/preferences',
        icon: Settings2,
      },
      {
        label: 'Profile',
        href: '/[organizationSlug]/settings/account/profile',
        icon: User,
      },
      {
        label: 'Notifications',
        href: '/[organizationSlug]/settings/account/notifications',
        icon: Bell,
      },
      {
        label: 'Security & access',
        href: '/[organizationSlug]/settings/account/security',
        icon: ShieldCheck,
      },
      {
        label: 'Connected accounts',
        href: '/[organizationSlug]/settings/account/connected-accounts',
        icon: Link2,
      },
      {
        label: 'Agent personalization',
        href: '/[organizationSlug]/settings/account/agent',
        icon: Bot,
      },
    ],
  },
  {
    group: 'Administration',
    items: [
      {
        label: 'General',
        href: '/[organizationSlug]/settings/general',
        icon: Settings2,
      },
      {
        label: 'Branding',
        href: '/[organizationSlug]/settings/branding',
        icon: Palette,
      },
      {
        label: 'Notifications',
        href: '/[organizationSlug]/settings/notifications',
        icon: Bell,
      },
      {
        label: 'Billing',
        href: '/[organizationSlug]/settings/billing',
        icon: CreditCardIcon,
      },
      {
        label: 'Policies',
        href: '/[organizationSlug]/settings/policies',
        icon: BookAIcon,
      },
      {
        label: 'Roles',
        href: '/[organizationSlug]/settings/roles',
        icon: KeyRound,
      },
      {
        label: 'Organizations',
        href: '/[organizationSlug]/settings/organizations',
        icon: Building2,
      },
    ],
  },
  {
    group: 'Workspace',
    items: [
      {
        label: 'Members',
        href: '/[organizationSlug]/settings/members',
        icon: Users,
      },
      {
        label: 'Teams',
        href: '/[organizationSlug]/settings/teams',
        icon: UsersRound,
      },
      {
        label: 'Invitations',
        href: '/[organizationSlug]/settings/invitations',
        icon: Mail,
      },
    ],
  },
  {
    group: 'Projects',
    items: [
      {
        label: 'Tags',
        href: '/[organizationSlug]/settings/projects',
        icon: Tag,
      },
    ],
  },
]
