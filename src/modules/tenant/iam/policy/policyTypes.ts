// src/modules/tenant/iam/policy/policyTypes.ts
import { z } from 'zod'

export const EffectSchema = z.enum(['Allow', 'Deny'])
export type Effect = z.infer<typeof EffectSchema>

export const PolicyStatementResponseSchema = z.object({
  id: z.uuid(),
  action: z.string(),
  resource: z.string(),
  effect: EffectSchema,
})

export const PolicyResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  scope: z.string(),
  isManaged: z.boolean(),
  isSystemPolicy: z.boolean(),
  statements: z.array(PolicyStatementResponseSchema),
})

export const CreatePolicyStatementSchema = z.object({
  action: z.string().min(1).max(100),
  resource: z.string().min(1).max(200).default('*'),
  effect: EffectSchema.default('Allow'),
})

export const CreatePolicySchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  scope: z.string().min(1),
  statements: z.array(CreatePolicyStatementSchema),
})

export const UpdatePolicySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
})

export const AddPolicyStatementSchema = z.object({
  action: z.string().min(1).max(100),
  resource: z.string().min(1).max(200).default('*'),
  effect: EffectSchema.default('Allow'),
})

export const RemovePolicyStatementSchema = z.object({
  policyId: z.uuid(),
  statementId: z.uuid(),
})

export const PermissionActionResponseSchema = z.object({
  action: z.string(),
  label: z.string(),
})

export const PermissionGroupResponseSchema = z.object({
  label: z.string(),
  scope: z.string(),
  resourcePattern: z.string(),
  allActionsPattern: z.string(),
  actions: z.array(PermissionActionResponseSchema),
})

export const AvailablePermissionsResponseSchema = z.object({
  effects: z.array(z.string()),
  groups: z.array(PermissionGroupResponseSchema),
})

export type PolicyStatementResponse = z.infer<
  typeof PolicyStatementResponseSchema
>
export type PolicyResponse = z.infer<typeof PolicyResponseSchema>
export type CreatePolicyStatementDto = z.infer<
  typeof CreatePolicyStatementSchema
>
export type CreatePolicyCommand = z.infer<typeof CreatePolicySchema>
export type UpdatePolicyCommand = z.infer<typeof UpdatePolicySchema>
export type AddPolicyStatementCommand = z.infer<typeof AddPolicyStatementSchema>
export type RemovePolicyStatementCommand = z.infer<
  typeof RemovePolicyStatementSchema
>
export type PermissionActionResponse = z.infer<
  typeof PermissionActionResponseSchema
>
export type PermissionGroupResponse = z.infer<
  typeof PermissionGroupResponseSchema
>
export type AvailablePermissionsResponse = z.infer<
  typeof AvailablePermissionsResponseSchema
>
