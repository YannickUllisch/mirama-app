// src/modules/tenant/iam/scopeConfig.ts
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import {
  Briefcase,
  Building2,
  FolderKanban,
  type LucideIcon,
} from 'lucide-react'

export type ScopeVisual = {
  label: string
  icon: LucideIcon
  /** Always-on colored icon class */
  iconClass: string
  /** Classes applied to TabsTrigger for active scope tint */
  tabActiveClass: string
  /** Pill/badge: bg + text */
  accentClass: string
  /** Solid dot bg color */
  dotClass: string
}

export const SCOPE_VISUALS: Record<AccessScope, ScopeVisual> = {
  [AccessScope.Organization]: {
    label: 'Organization',
    icon: Building2,
    iconClass: 'text-lava',
    tabActiveClass:
      'data-[state=active]:bg-lava/10 data-[state=active]:text-lava data-[state=active]:shadow-none',
    accentClass: 'bg-lava/10 text-lava',
    dotClass: 'bg-lava',
  },
  [AccessScope.Project]: {
    label: 'Project',
    icon: FolderKanban,
    iconClass: 'text-mirama',
    tabActiveClass:
      'data-[state=active]:bg-mirama/10 data-[state=active]:text-mirama data-[state=active]:shadow-none',
    accentClass: 'bg-mirama/10 text-mirama',
    dotClass: 'bg-mirama',
  },
  [AccessScope.Client]: {
    label: 'Client',
    icon: Briefcase,
    iconClass: 'text-warning',
    tabActiveClass:
      'data-[state=active]:bg-warning/10 data-[state=active]:text-warning data-[state=active]:shadow-none',
    accentClass: 'bg-warning/10 text-warning',
    dotClass: 'bg-warning',
  },
}
