import { z } from 'zod'

export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50),
  description: z.string().max(200).optional(),
})

export type CreateRoleRequest = z.infer<typeof CreateRoleSchema>
