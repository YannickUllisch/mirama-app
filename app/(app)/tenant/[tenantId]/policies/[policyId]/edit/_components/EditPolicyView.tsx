// app/(app)/tenant/[tenantId]/policies/[policyId]/edit/_components/EditPolicyView.tsx
'use client'

import { PolicyForm } from '@src/modules/tenant/iam/policy/components/PolicyForm'
import policyHooks from '@src/modules/tenant/iam/policy/policy.hooks'
import { Loader2 } from 'lucide-react'

export const EditPolicyView = ({ policyId }: { policyId: string }) => {
  const { data: policy, isLoading } = policyHooks.fetchById.useQuery(policyId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="text-center py-24 text-muted-foreground text-sm">
        Policy not found.
      </div>
    )
  }

  return <PolicyForm defaultPolicy={policy} />
}
