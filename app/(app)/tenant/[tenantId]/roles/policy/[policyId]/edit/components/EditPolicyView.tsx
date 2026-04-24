'use client'

import type { CreatePolicyRequest } from '@/server/modules/account/policies/features/create-policy/schema'
import apiRequest from '@hooks'
import { PolicyForm } from '@src/modules/tenant/iam/policy/components/PolicyForm'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Button } from '@ui/button'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const EditPolicyView = ({ policyId }: { policyId: string }) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()
  const [isPending, startTransition] = useTransition()
  const { data: policies = [], isLoading } =
    apiRequest.policy.fetchAll.useQuery()
  const { mutate: updatePolicy } = apiRequest.policy.update.useMutation()

  const policy = policies.find((p) => p.id === policyId)

  const handleSubmit = (data: CreatePolicyRequest) => {
    startTransition(() => {
      updatePolicy(
        { id: policyId, data },
        { onSuccess: () => router.push(`/tenant/${activeTenantId}/roles`) },
      )
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Button
        onClick={() => router.back()}
        variant={'link'}
        className="text-xs"
      >
        <ChevronLeft className="w-3 h-3" />
        Back to Roles &amp; Policies
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-warm-gray-300" />
        </div>
      ) : policy ? (
        <PolicyForm
          defaultPolicy={policy}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isPending={isPending}
        />
      ) : (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Policy not found.
        </div>
      )}
    </div>
  )
}
