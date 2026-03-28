import type { Member } from '@prisma/client'

export type MemberResponse = {
  id: string
  name: string
  email: string
  organizationRole: string
}

export const toMemberResponse = (member: Member): MemberResponse => ({
  id: member.id,
  name: member.name,
  email: member.email,
  organizationRole: member.role,
})
