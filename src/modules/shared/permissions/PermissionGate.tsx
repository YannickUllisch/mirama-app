// src/modules/shared/permissions/PermissionGate.tsx
import { resolvePermissions } from '@/server/shared/domain/resolve-permissions'
import { auth } from '@auth'
import { PermissionProvider } from './PermissionContext'

/**
 * Server component that resolves the current user's flattened permissions
 * and wraps children in a PermissionProvider.
 *
 * Usage in a layout:
 * ```tsx
 * <PermissionGate organizationId={orgId} projectId={projectId}>
 *   {children}
 * </PermissionGate>
 * ```
 *
 * The resolved grants are passed as a plain string[] — fully serialisable
 * and compatible with PPR streaming.
 */
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

  if (!session?.user?.email) {
    return <PermissionProvider grants={[]}>{children}</PermissionProvider>
  }

  const grants = await resolvePermissions(
    session.user.email,
    organizationId,
    projectId,
  )

  return <PermissionProvider grants={grants}>{children}</PermissionProvider>
}

export default PermissionGate
