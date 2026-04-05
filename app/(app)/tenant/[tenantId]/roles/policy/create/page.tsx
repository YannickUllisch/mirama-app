import { CreatePolicyView } from '@/app/(app)/tenant/[tenantId]/roles/policy/create/components/CreatePolicyView'
import type { AccessScope } from '@/prisma/generated/client'

const CreatePolicyPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ defaultScope?: string }>
}) => {
  const { defaultScope } = await searchParams
  return (
    <CreatePolicyView defaultScope={defaultScope as AccessScope | undefined} />
  )
}

export default CreatePolicyPage
