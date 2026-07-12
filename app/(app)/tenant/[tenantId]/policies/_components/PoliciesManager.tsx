// app/(app)/tenant/[tenantId]/policies/_components/PoliciesManager.tsx
'use client'

import { cn } from '@src/lib/utils'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { PolicyScopeTab } from './PolicyScopeTab'
import { SCOPE_VISUALS } from './scopeConfig'

const SCOPES = [
  AccessScope.Organization,
  AccessScope.Project,
  AccessScope.Client,
] as const

export const PoliciesManager = () => {
  return (
    <Tabs defaultValue={AccessScope.Organization}>
      <TabsList className="h-9 bg-muted p-1">
        {SCOPES.map((scope) => {
          const {
            label,
            icon: Icon,
            tabActiveClass,
            iconClass,
          } = SCOPE_VISUALS[scope]
          return (
            <TabsTrigger
              key={scope}
              value={scope}
              className={cn('gap-1.5 text-xs', tabActiveClass)}
            >
              <Icon className={cn('h-3.5 w-3.5', iconClass)} />
              {label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {SCOPES.map((scope) => (
        <TabsContent key={scope} value={scope} className="mt-4">
          <PolicyScopeTab scope={scope} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
