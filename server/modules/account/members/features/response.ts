import type { Member } from '@/prisma/generated/client'

export type MemberResponse = {
  id: string
  name: string
  email: string
  iamRoleId: string
}

export const toMemberResponse = (member: Member): MemberResponse => ({
  id: member.id,
  name: member.name,
  email: member.email,
  iamRoleId: member.iamRoleId,
})
