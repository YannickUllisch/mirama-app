export type TenantRole = 'Owner' | 'Assumed'

export type AuthMeResponse = {
  userId: string
  tenantId: string
  tenantRole: TenantRole
  name: string
  email: string
  isOnboarded: boolean
  organizationInfo?: AuthOrgMembershipResponse | null
  image?: string | null
}

export type AuthOrgMembershipResponse = {
  organizationId: string
  userId: string
  tenantRole: TenantRole
  tenantId: string
  memberId: string
  iamRoleIds: string[]
}
