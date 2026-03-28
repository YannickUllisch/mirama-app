import type { Organization } from '@prisma/client'

export type OrganizationResponse = {
  id: string
  name: string
  slug: string
  street: string
  city: string
  state: string
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
  state: org.state,
  zipCode: org.zipCode,
  dateCreated: org.dateCreated,
})
