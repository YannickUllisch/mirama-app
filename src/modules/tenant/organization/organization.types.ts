// src/modules/tenant/organization/organization.types.ts
import { z } from 'zod'

export enum OrganizationRegion {
  EuropeanUnion = 0,
  UnitedStates = 1,
  RestOfWorld = 2,
}

const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
  .max(7)
  .nullable()
  .optional()

export const OrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable().optional(),
  street: z.string(),
  city: z.string(),
  country: z.string(),
  zipCode: z.string(),
  region: z.string(),
  regionValue: z.number().int(),
  primaryColor: z.string().nullable().optional(),
  accentColor: z.string().nullable().optional(),
  dateCreated: z.coerce.date(),
  tenantId: z.string(),
  memberCount: z.number().int(),
  projectCount: z.number().int(),
})
export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  // Chosen once, at creation - it's the organization's URL segment
  // (/organization/{slug}/...) and is frozen server-side after that (see Organization.Update
  // on the backend). Format/uniqueness are both re-checked by the backend regardless.
  slug: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(63, 'Must be 63 characters or fewer')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Can only contain lowercase letters, numbers and hyphens, and can't start or end with a hyphen.",
    ),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  region: z.nativeEnum(OrganizationRegion),
  logo: z.string().max(500).nullable().optional(),
  primaryColor: hexColorSchema,
  accentColor: hexColorSchema,
})
export type CreateOrganizationCommand = z.infer<typeof CreateOrganizationSchema>

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  region: z.nativeEnum(OrganizationRegion),
  logo: z.string().max(500).nullable().optional(),
  primaryColor: hexColorSchema,
  accentColor: hexColorSchema,
})
export type UpdateOrganizationCommand = z.infer<typeof UpdateOrganizationSchema>
