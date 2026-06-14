export type TenantRole = 'OWNER' | 'ASSUMED'

export type AuthMeResponse = {
  userId: string
  tenantId: string
  name: string
  email: string
  isOnboarded: boolean
  organizationInfo?: AuthOrgMembershipResponse | null
  image?: string | null
}

export type AuthOrgMembershipResponse = {
  organizationId: string
  userId: string
  tenantId: string
  memberId: string
  iamRoleId: string
}
