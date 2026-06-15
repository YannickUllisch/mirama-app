import { TenantRole } from '@/prisma/generated/client'
import type { AppMenuItem } from '@src/types/types'
import { CreditCardIcon, Home, SettingsIcon, ShieldCheck } from 'lucide-react'

export const TenantSidebarMenu: AppMenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/tenant/[tenantId]',
    isCollapsible: false,
    roles: Object.values(TenantRole) as TenantRole[],
  },
  {
    title: 'IAM',
    icon: ShieldCheck,
    isCollapsible: true,
    isActive: true,
    roles: Object.values(TenantRole) as TenantRole[],
    items: [
      {
        title: 'Roles',
        href: '/tenant/[tenantId]/roles',
        roles: Object.values(TenantRole) as TenantRole[],
      },
      {
        title: 'Policies',
        href: '/tenant/[tenantId]/policies',
        roles: Object.values(TenantRole) as TenantRole[],
      },
    ],
  },
  {
    title: 'Billing',
    icon: CreditCardIcon,
    isCollapsible: true,
    isActive: true,
    roles: Object.values(TenantRole) as TenantRole[],
    items: [
      {
        title: 'Usage',
        href: '/tenant/[tenantId]/billing',
        roles: Object.values(TenantRole) as TenantRole[],
      },
      {
        title: 'Plans',
        href: '/tenant/[tenantId]/billing/plans',
        roles: Object.values(TenantRole) as TenantRole[],
      },
    ],
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    href: '/tenant/[tenantId]/settings',
    isCollapsible: false,
    roles: Object.values(TenantRole) as TenantRole[],
  },
]
