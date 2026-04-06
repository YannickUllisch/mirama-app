import type { Organization } from '@/prisma/generated/client'

export type OrganizationResponse = {
  id: string
  name: string
  slug: string
  street: string
  city: string
  country: string
  zipCode: string
  dateCreated: Date
}

export type OrganizationListResponse = OrganizationResponse & {
  _count: { members: number; projects: number }
}

export const toOrganizationResponse = (
  org: Organization,
): OrganizationResponse => ({
  id: org.id,
  name: org.name,
  slug: org.slug,
  street: org.street,
  city: org.city,
  country: org.country,
  zipCode: org.zipCode,
  dateCreated: org.dateCreated,
})
