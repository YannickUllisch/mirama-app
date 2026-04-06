// app/(app)/tenant/[tenantId]/roles/policy/[policyId]/edit/page.tsx
import { Suspense } from 'react'
import { EditPolicyView } from './components/EditPolicyView'
import EditPolicyViewSkeleton from './components/EditPolicyViewSkeleton'

const EditPolicyPage = async ({
  params,
}: {
  params: Promise<{ policyId: string }>
}) => {
  const { policyId } = await params
  return (
    <Suspense fallback={<EditPolicyViewSkeleton />}>
      <EditPolicyView policyId={policyId} />
    </Suspense>
  )
}

export default EditPolicyPage
