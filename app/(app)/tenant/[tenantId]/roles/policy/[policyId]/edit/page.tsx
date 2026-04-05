import { EditPolicyView } from '@/app/(app)/tenant/[tenantId]/roles/policy/[policyId]/edit/components/EditPolicyView'

const EditPolicyPage = async ({
  params,
}: {
  params: Promise<{ policyId: string }>
}) => {
  const { policyId } = await params
  return <EditPolicyView policyId={policyId} />
}

export default EditPolicyPage
