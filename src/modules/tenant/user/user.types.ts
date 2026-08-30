import type { TenantRole } from '@server/auth/types'
import { z } from 'zod'

const tenantRoles = ['Owner', 'Assumed'] satisfies TenantRole[]

export const UserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  role: z.string(),
})
export type UserResponse = z.infer<typeof UserResponseSchema>

export const UpdateUserSchema = z.object({
  name: z.string().min(3).max(25),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  role: z.enum(tenantRoles),
  title: z.string().nullable().optional(),
  defaultOrganizationId: z.uuid().nullable().optional(),
})
export type UpdateUserCommand = z.infer<typeof UpdateUserSchema>
