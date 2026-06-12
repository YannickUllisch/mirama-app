// src/modules/tenant/iam/roles/roleTypes.ts
import { z } from 'zod'
import { PolicyResponseSchema } from '../policy/policy.types'

export enum AccessScope {
  Organization = 'Organization',
  Project = 'Project',
  Client = 'Client',
}

export const RoleWithPoliciesResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  scope: z.string(),
  isSystemRole: z.boolean(),
  policies: z.array(PolicyResponseSchema),
})

export const RoleResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  scope: z.string(),
  isSystemRole: z.boolean(),
  policyIds: z.array(z.uuid()),
})

export const CreateRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  scope: z.string().min(1),
})

export const UpdateRoleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
})

export type RoleWithPoliciesResponse = z.infer<
  typeof RoleWithPoliciesResponseSchema
>
export type RoleResponse = z.infer<typeof RoleResponseSchema>
export type CreateRoleCommand = z.infer<typeof CreateRoleSchema>
export type UpdateRoleCommand = z.infer<typeof UpdateRoleSchema>
