// app/(app)/organization/[organizationId]/settings/roles/create/page.tsx
import { RoleForm } from '@src/modules/tenant/iam/roles/components/RoleForm'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { Suspense } from 'react'

const CreateRolePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ defaultScope?: string }>
}) => {
  const { defaultScope } = await searchParams
  return (
    <Suspense>
      <RoleForm defaultScope={defaultScope as AccessScope | undefined} />
    </Suspense>
  )
}

export default CreateRolePage
