import { OrganizationRoleSchema } from '@/serverOld/domain/enumSchemas'
import { z } from 'zod'

export const UpdateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  organizationRole: OrganizationRoleSchema.optional(),
})

export type UpdateMemberRequest = z.infer<typeof UpdateMemberSchema>
