import { z } from 'zod'

export const MemberResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  userId: z.string().nullable().optional(),
  iamRoleIds: z.array(z.string()),
  organizationId: z.string(),
})
export type MemberResponse = z.infer<typeof MemberResponseSchema>

export const UpdateMemberSchema = z.object({
  iamRoleId: z.string(),
})
export type UpdateMemberCommand = z.infer<typeof UpdateMemberSchema>
