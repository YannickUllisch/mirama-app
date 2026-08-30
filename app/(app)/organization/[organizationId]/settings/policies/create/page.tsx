// app/(app)/organization/[organizationId]/settings/policies/create/page.tsx
import { PolicyForm } from '@src/modules/tenant/iam/policy/components/PolicyForm'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'

const CreatePolicyPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ defaultScope?: string }>
}) => {
  const { defaultScope } = await searchParams
  return <PolicyForm defaultScope={defaultScope as AccessScope | undefined} />
}

export default CreatePolicyPage
