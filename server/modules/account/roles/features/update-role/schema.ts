import { z } from 'zod'

export const UpdateRoleSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  scope: z.enum(['ORGANIZATION', 'PROJECT']).optional(),
})

export const RoleIdParams = z.object({
  roleId: z.string().min(1),
})

export const AttachPolicySchema = z.object({
  policyId: z.string().min(1),
})

export type UpdateRoleRequest = z.infer<typeof UpdateRoleSchema>
