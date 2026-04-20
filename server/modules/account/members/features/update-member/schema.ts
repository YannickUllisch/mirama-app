import { z } from 'zod'

export const UpdateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  iamRoleId: z.string().min(1).optional(),
})

export type UpdateMemberRequest = z.infer<typeof UpdateMemberSchema>
