// app/(app)/tenant/[tenantId]/policies/_components/PoliciesManager.tsx
'use client'

import { cn } from '@src/lib/utils'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { PolicyScopeTab } from './PolicyScopeTab'
import { SCOPE_VISUALS } from './scopeConfig'

const SCOPE_TABS = [
  AccessScope.Organization,
  AccessScope.Project,
  AccessScope.Client,
] as const

export const PoliciesManager = () => (
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
        <PolicyScopeTab scope={scope} />
      </TabsContent>
    ))}
  </Tabs>
)
