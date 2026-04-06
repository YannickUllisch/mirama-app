// app/(app)/tenant/[tenantId]/roles/policy/create/page.tsx
import type { AccessScope } from '@/prisma/generated/client'
import { Suspense } from 'react'
import { CreatePolicyView } from './components/CreatePolicyView'
import CreatePolicyViewSkeleton from './components/CreatePolicyViewSkeleton'

const CreatePolicyPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ defaultScope?: string }>
}) => {
  const { defaultScope } = await searchParams
  return (
    <Suspense fallback={<CreatePolicyViewSkeleton />}>
      <CreatePolicyView
        defaultScope={defaultScope as AccessScope | undefined}
      />
    </Suspense>
  )
}

export default CreatePolicyPage
