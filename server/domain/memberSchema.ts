import z from 'zod'
import { OrganizationRoleSchema } from './enumSchemas'

export const MemberResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  organizationRole: OrganizationRoleSchema,
})

export const UpdateMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  organizationRole: OrganizationRoleSchema,
})

export const MemberProjectJoinResponseSchema = z.object({
  id: z.string().uuid(),
  organizationRole: OrganizationRoleSchema,
  name: z.string(),
  email: z.string(),
  organizationId: z.string().nullable(),
  isManager: z.boolean(),
})

// TypeScript types inferred from schemas
export type UpdateMemberType = z.infer<typeof UpdateMemberSchema>
export type MemberResponseType = z.infer<typeof MemberResponseSchema>
export type MemberProjectJoinResponseType = z.infer<
  typeof MemberProjectJoinResponseSchema
>
