'use client'

import type { AccessScope } from '@/prisma/generated/client'
import type { CreatePolicyRequest } from '@/server/modules/account/policies/features/create-policy/schema'
import apiRequest from '@hooks/query'
import { PolicyForm } from '@src/modules/tenant/iam/policy/components/PolicyForm'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Button } from '@ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const CreatePolicyView = ({
  defaultScope,
}: {
  defaultScope?: AccessScope
}) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()
  const [isPending, startTransition] = useTransition()
  const { mutate: createPolicy } = apiRequest.policy.create.useMutation()

  const handleSubmit = (data: CreatePolicyRequest) => {
    startTransition(() => {
      createPolicy(data, {
        onSuccess: () => router.push(`/tenant/${activeTenantId}/roles`),
      })
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

      <PolicyForm
        defaultScope={defaultScope}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isPending={isPending}
      />
    </div>
  )
}
