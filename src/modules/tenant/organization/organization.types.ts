// src/modules/tenant/organization/organization.types.ts
import { z } from 'zod'

export const OrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable().optional(),
  street: z.string(),
  city: z.string(),
  country: z.string(),
  zipCode: z.string(),
  dateCreated: z.coerce.date(),
  tenantId: z.string(),
  memberCount: z.number().int(),
  projectCount: z.number().int(),
})
export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  logo: z.string().max(500).nullable().optional(),
})
export type CreateOrganizationCommand = z.infer<typeof CreateOrganizationSchema>

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  logo: z.string().max(500).nullable().optional(),
})
export type UpdateOrganizationCommand = z.infer<typeof UpdateOrganizationSchema>
