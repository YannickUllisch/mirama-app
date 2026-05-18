// app/(app)/tenant/[tenantId]/roles/policy/[policyId]/edit/components/EditPolicyView.tsx
'use client'

import { PolicyForm } from '@src/modules/tenant/iam/policy/components/PolicyForm'
import policyHooks from '@src/modules/tenant/iam/policy/hooks/hooks'
import type { CreatePolicyCommand } from '@src/modules/tenant/iam/policy/policyTypes'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const EditPolicyView = ({ policyId }: { policyId: string }) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()
  const [isPending, startTransition] = useTransition()
  const { data: policy, isLoading } = policyHooks.fetchById.useQuery(policyId)
  const { mutate: updatePolicy } = policyHooks.update.useMutation()

  const handleSubmit = (data: CreatePolicyCommand) => {
    startTransition(() => {
      updatePolicy(
        {
          id: policyId,
          data: { name: data.name, description: data.description, statements: data.statements },
        },
        { onSuccess: () => router.push(`/tenant/${activeTenantId}/roles`) },
      )
    })
  }

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

  return (
    <PolicyForm
      defaultPolicy={policy}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isPending={isPending}
    />
  )
}
