import { auth } from '@auth'
import {
  fetchFlatMemberScopedPermissionsServer,
  fetchFlatProjectScopedPermissionsServer,
} from '@src/modules/tenant/iam/hooks/iam.server'
import { PermissionProvider } from './PermissionContext'

const PermissionGate = async ({
  children,
  organizationId,
  projectId,
}: {
  children: React.ReactNode
  organizationId: string
  projectId?: string
}) => {
  const session = await auth()
  const memberId = session?.user?.memberId

  if (!memberId) {
    return <PermissionProvider grants={[]}>{children}</PermissionProvider>
  }

  const grants = projectId
    ? await fetchFlatProjectScopedPermissionsServer(
        organizationId,
        memberId,
        projectId,
      )
    : await fetchFlatMemberScopedPermissionsServer(organizationId, memberId)

  return <PermissionProvider grants={grants}>{children}</PermissionProvider>
}

export default PermissionGate
