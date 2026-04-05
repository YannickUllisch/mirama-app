import { z } from 'zod'

const StatementSchema = z.object({
  effect: z.enum(['ALLOW', 'DENY']),
  action: z.string().min(1),
  resource: z.string().min(1),
})

export const UpdatePolicySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(200).optional(),
  scope: z.enum(['ORGANIZATION', 'PROJECT']).optional(),
  statements: z.array(StatementSchema).min(1).optional(),
})

export const PolicyIdParams = z.object({
  policyId: z.string().min(1),
})

export type UpdatePolicyRequest = z.infer<typeof UpdatePolicySchema>
