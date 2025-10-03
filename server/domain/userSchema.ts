import z from 'zod'
import { RoleSchema } from './roleSchema'

export const DeleteUsersSchema = z.array(
  z.string().min(1, 'Array of atleast one ID is required'),
)

export const UpdateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: RoleSchema,
  emailVerified: z.coerce.date().nullable(),
  password: z.string().nullable(),
  teamId: z.string().nullable(),
  preferredDateType: z.string(),
})

export const UserProjectResponseSchema = z.object({
  id: z.string().uuid(),
  role: RoleSchema,
  name: z.string(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  password: z.string().nullable(),
  teamId: z.string().nullable(),
  preferredDateType: z.string(),
  isManager: z.boolean(),
})

// TypeScript types inferred from schemas
export type UpdateUserinput = z.infer<typeof UpdateUserSchema>
export type DeletUserInput = z.infer<typeof DeleteUsersSchema>
export type UserProjectResponseInput = z.infer<typeof UserProjectResponseSchema>
