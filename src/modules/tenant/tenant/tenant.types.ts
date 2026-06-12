// src/modules/tenant/settings/hooks/types.ts
import { z } from 'zod'

export const TenantSettingsResponseSchema = z.object({
  name: z.string(),
  isActive: z.boolean(),
  timezone: z.string(),
  brandingColor: z.string().nullable(),
  logoUrl: z.string().nullable(),
  receiveNotifications: z.boolean(),
})

export const PlanResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  interval: z.string(),
  features: z.array(z.string()),
})

export const SubscriptionResponseSchema = z.object({
  status: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
  plan: PlanResponseSchema,
})

export const TenantResponseSchema = z.object({
  id: z.uuid(),
  adminUserId: z.uuid(),
  settings: TenantSettingsResponseSchema,
  subscription: SubscriptionResponseSchema,
})

export const UpdateTenantSettingsSchema = z.object({
  name: z.string().min(1),
  timezone: z.string().min(1),
  brandingColor: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  receiveNotifications: z.boolean(),
})

export type TenantSettingsResponse = z.infer<
  typeof TenantSettingsResponseSchema
>
export type PlanResponse = z.infer<typeof PlanResponseSchema>
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>
export type TenantResponse = z.infer<typeof TenantResponseSchema>
export type UpdateTenantSettingsRequest = z.infer<
  typeof UpdateTenantSettingsSchema
>
