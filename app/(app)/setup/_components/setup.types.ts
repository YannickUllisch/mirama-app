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
  logo: z.string().max(500).nullable().optional(),
  region: z.enum(OrganizationRegion),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
})
export type OrganizationSetupCommand = z.infer<typeof OrganizationSetupSchema>
