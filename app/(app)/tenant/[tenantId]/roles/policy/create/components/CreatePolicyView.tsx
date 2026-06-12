// app/(app)/tenant/[tenantId]/roles/policy/create/components/CreatePolicyView.tsx
'use client'

import { PolicyForm } from '@src/modules/tenant/iam/policy/components/PolicyForm'
import policyHooks from '@src/modules/tenant/iam/policy/hooks/policy.hooks'
import type { CreatePolicyCommand } from '@src/modules/tenant/iam/policy/policy.types'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
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
  const { mutate: createPolicy } = policyHooks.create.useMutation()

  const handleSubmit = (data: CreatePolicyCommand) => {
    startTransition(() => {
      createPolicy(data, {
        onSuccess: () => router.push(`/tenant/${activeTenantId}/roles`),
      })
    })
  }

  return (
    <PolicyForm
      defaultScope={defaultScope}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isPending={isPending}
    />
  )
}
