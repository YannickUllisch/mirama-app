import { TenantRole } from '@prisma/client'
import type { AppMenuItem } from '@src/types/types'
import { CreditCardIcon, Home } from 'lucide-react'

export const TenantSidebarMenu: AppMenuItem[] = [
  {
    title: 'Tenant Dashboard',
    icon: Home,
    href: '/tenant',
    isCollapsible: false,
    roles: Object.values(TenantRole) as TenantRole[],
  },
  {
    title: 'Tenant Billing',
    icon: CreditCardIcon,
    href: '/tenant',
    isCollapsible: false,
    roles: Object.values(TenantRole) as TenantRole[],
  },
]
