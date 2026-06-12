// app/(app)/tenant/[tenantId]/roles/_components/RolesManager.tsx
'use client'

import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { Briefcase, Building2, FolderKanban } from 'lucide-react'
import { RolesScopeTab } from './RolesScopeTab'

const SCOPE_TABS = [
  { scope: AccessScope.Organization, label: 'Organization', icon: Building2 },
  { scope: AccessScope.Project, label: 'Project', icon: FolderKanban },
  { scope: AccessScope.Client, label: 'Client', icon: Briefcase },
] as const

export const RolesManager = () => (
  <Tabs defaultValue={AccessScope.Organization} className="space-y-4">
    <TabsList className="h-9">
      {SCOPE_TABS.map(({ scope, label, icon: Icon }) => (
        <TabsTrigger key={scope} value={scope} className="text-xs gap-1.5">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>

    {SCOPE_TABS.map(({ scope }) => (
      <TabsContent key={scope} value={scope} className="mt-0">
        <RolesScopeTab scope={scope} />
      </TabsContent>
    ))}
  </Tabs>
)
