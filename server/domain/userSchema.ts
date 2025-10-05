import z from 'zod'
import { RoleSchema } from './enumSchemas'

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: RoleSchema,
  teamId: z.string().nullable(),
  preferredDateType: z.string(),
})

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
export type UpdateUserType = z.infer<typeof UpdateUserSchema>
export type UserResponseType = z.infer<typeof UpdateUserSchema>
export type DeleteUserType = z.infer<typeof DeleteUsersSchema>
export type UserProjectResponseType = z.infer<typeof UserProjectResponseSchema>
