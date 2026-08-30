// app/(app)/organization/[organizationId]/settings/policies/[policyId]/edit/page.tsx
import { Suspense } from 'react'
import { EditPolicyView } from './_components/EditPolicyView'

const EditPolicyPage = async ({
  params,
}: {
  params: Promise<{ policyId: string }>
}) => {
  const { policyId } = await params
  return (
    <Suspense>
      <EditPolicyView policyId={policyId} />
    </Suspense>
  )
}

export default EditPolicyPage
