import { z } from 'zod'

const StatementSchema = z.object({
  effect: z.enum(['ALLOW', 'DENY']),
  action: z.string().min(1),
  resource: z.string().min(1),
})

export const CreatePolicySchema = z.object({
  name: z.string().min(1, 'Policy name is required').max(100),
  description: z.string().max(200).optional(),
  scope: z.enum(['ORGANIZATION', 'PROJECT']),
  statements: z
    .array(StatementSchema)
    .min(1, 'At least one statement required'),
})

export type CreatePolicyRequest = z.infer<typeof CreatePolicySchema>
