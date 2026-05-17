// app/(app)/tenant/[tenantId]/roles/components/IamManager.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { FileText, ShieldCheck } from 'lucide-react'
import { PoliciesTab } from './PoliciesTab'
import { RolesManager } from './RolesManager'

export const IamManager = () => (
  <div>
    <Tabs defaultValue="roles" className="space-y-5">
      <TabsList className="h-9">
        <TabsTrigger value="roles" className="text-xs gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Roles
        </TabsTrigger>
        <TabsTrigger value="policies" className="text-xs gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Policies
        </TabsTrigger>
      </TabsList>

      <TabsContent value="roles" className="mt-0">
        <RolesManager />
      </TabsContent>

      <TabsContent value="policies" className="mt-0">
        <PoliciesTab />
      </TabsContent>
    </Tabs>
  </div>
)
