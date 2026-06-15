// src/modules/tenant/iam/hooks/server.ts
import serverApi from '@src/modules/shared/server-api'
import type {
  AvailablePermissionsResponse,
  MemberPermissions,
} from './iam.types'

export const fetchAllAvailablePermissionsServer = async (
  tenantId: string,
): Promise<AvailablePermissionsResponse> => {
  const { data } = await serverApi.get<AvailablePermissionsResponse>(
    `tenant/${tenantId}/available-permissions`,
  )
  return data
}

export const fetchFlatMemberScopedPermissionsServer = async (
  organizationId: string,
  memberId: string,
): Promise<MemberPermissions> => {
  const { data } = await serverApi.get<MemberPermissions>(
    `organization/${organizationId}/members/${memberId}/permissions`,
  )
  return data
}

export const fetchFlatProjectScopedPermissionsServer = async (
  organizationId: string,
  memberId: string,
  projectId: string,
): Promise<MemberPermissions> => {
  const { data } = await serverApi.get<MemberPermissions>(
    `organization/${organizationId}/members/${memberId}/projects/${projectId}/permissions`,
  )
  return data
}
