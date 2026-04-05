import { z } from 'zod'

export const UpdateTenantSettingsSchema = z.object({
  timezone: z.string().min(1).optional(),
  brandingColor: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  receiveNotifications: z.boolean().optional(),
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
})

export type UpdateTenantSettingsRequest = z.infer<
  typeof UpdateTenantSettingsSchema
>
