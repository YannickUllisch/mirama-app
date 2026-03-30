import { TenantRole } from '@prisma/client'
import type { AppMenuItem } from '@src/types/types'
import { CreditCardIcon, Home } from 'lucide-react'

export const TenantSidebarMenu: AppMenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/tenant/[tenantId]',
    isCollapsible: false,
    roles: Object.values(TenantRole) as TenantRole[],
  },
  {
    title: 'Tenant Billing',
    icon: CreditCardIcon,
    href: '/tenant/[tenantId]/billing',
    isCollapsible: false,
    roles: Object.values(TenantRole) as TenantRole[],
  },
]
