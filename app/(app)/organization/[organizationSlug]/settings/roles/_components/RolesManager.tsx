// app/(app)/organization/[organizationSlug]/settings/roles/_components/RolesManager.tsx
'use client'

import { cn } from '@src/lib/utils'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { SCOPE_VISUALS } from '@src/modules/tenant/iam/scopeConfig'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { RolesScopeTab } from './RolesScopeTab'

const SCOPE_TABS = [
  AccessScope.Organization,
  AccessScope.Project,
  AccessScope.Client,
] as const

export const RolesManager = () => (
  <Tabs defaultValue={AccessScope.Organization} className="space-y-4">
    <TabsList className="h-9">
      {SCOPE_TABS.map((scope) => {
        const {
          label,
          icon: Icon,
          iconClass,
          tabActiveClass,
        } = SCOPE_VISUALS[scope]
        return (
          <TabsTrigger
            key={scope}
            value={scope}
            className={cn('text-xs gap-1.5', tabActiveClass)}
          >
            <Icon className={cn('w-3.5 h-3.5', iconClass)} />
            {label}
          </TabsTrigger>
        )
      })}
    </TabsList>

    {SCOPE_TABS.map((scope) => (
      <TabsContent key={scope} value={scope} className="mt-0">
        <RolesScopeTab scope={scope} />
      </TabsContent>
    ))}
  </Tabs>
)
