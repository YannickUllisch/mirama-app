import { z } from 'zod'

export const TagResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  color: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  scope: z.string(),
  scopeValue: z.number().int(),
  organizationId: z.string(),
  dateCreated: z.coerce.date(),
})
export type TagResponse = z.infer<typeof TagResponseSchema>

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .max(7)
    .nullable()
    .optional(),
  description: z.string().max(500).nullable().optional(),
  scope: z.number().int().min(0),
})
export type CreateTagCommand = z.infer<typeof CreateTagSchema>

export const UpdateTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .max(7)
    .nullable()
    .optional(),
  description: z.string().max(500).nullable().optional(),
  scope: z.number().int().min(0),
})
export type UpdateTagCommand = z.infer<typeof UpdateTagSchema>
