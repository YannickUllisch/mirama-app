import { OrganizationRoleSchema } from '@server/shared/enumSchemas'
import { z } from 'zod'

export const UpdateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  organizationRole: OrganizationRoleSchema.optional(),
  iamRoleId: z.string().min(1).optional(),
})

export type UpdateMemberRequest = z.infer<typeof UpdateMemberSchema>
