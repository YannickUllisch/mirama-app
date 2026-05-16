export type TenantRole = 'OWNER' | 'ASSUMED'

export type AuthMeResponse = {
  id: string
  tenantId: string
  name: string
  email: string
  isOnboarded: boolean
  organizationInfo?: AuthOrgMembershipResponse | null
  image?: string | null
}

export type AuthOrgMembershipResponse = {
  id: string
  tenantId: string
  memberId: string
  iamRoleId: string
}
