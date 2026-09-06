import { OrganizationRegion } from '@src/modules/tenant/organization/organization.types'
import { z } from 'zod'

export const ProfileSetupSchema = z.object({
  name: z.string().min(3).max(25),
  title: z.string().max(100).optional(),
  avatar: z.string().min(1, 'Pick an avatar'),
})
export type ProfileSetupCommand = z.infer<typeof ProfileSetupSchema>

export const InviteSetupSchema = z.object({
  emails: z.array(z.string().email()).max(50),
})
export type InviteSetupCommand = z.infer<typeof InviteSetupSchema>

export const OrganizationSetupSchema = z.object({
  name: z.string().min(2).max(100),
  // Chosen here, in this step - it's the organization's URL and is frozen after creation
  // (see the backend's Organization.Update, which no longer touches Slug).
  slug: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(63, 'Must be 63 characters or fewer')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Can only contain lowercase letters, numbers and hyphens, and can't start or end with a hyphen.",
    ),
  logo: z.string().max(500).nullable().optional(),
  region: z.enum(OrganizationRegion),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
})
export type OrganizationSetupCommand = z.infer<typeof OrganizationSetupSchema>
