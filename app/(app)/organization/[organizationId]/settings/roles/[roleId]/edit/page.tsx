// app/(app)/organization/[organizationId]/settings/roles/[roleId]/edit/page.tsx
import { Suspense } from 'react'
import { EditRoleView } from './_components/EditRoleView'

const EditRolePage = async ({
  params,
}: {
  params: Promise<{ roleId: string }>
}) => {
  const { roleId } = await params
  return (
    <Suspense>
      <EditRoleView roleId={roleId} />
    </Suspense>
  )
}

export default EditRolePage
