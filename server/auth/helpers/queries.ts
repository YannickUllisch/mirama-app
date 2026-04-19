import { PrismaClient } from '@/prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { DateTime } from 'luxon'

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_PRISMA_URL,
})
export const client = new PrismaClient({ adapter })

export const getUserById = async (id: string) => {
  try {
    const user = await client.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        name: true,
        tenant: {
          select: {
            id: true,
          },
        },
      },
    })

    return user
  } catch {
    return null
  }
}

export const tryGetOrganization = async (userId: string, orgId: string) => {
  // User and Member are separate models — bridge via email
  const user = await client.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  console.info(`found user: ${user?.email}`)

  if (!user) return null

  const organization = await client.organization.findFirst({
    where: {
      id: orgId,
      members: { some: { email: user.email } },
    },
    select: {
      id: true,
      tenantId: true,
      members: {
        where: { email: user.email },
        select: { iamRoleId: true },
      },
    },
  })
  return organization
}

export const getValidCompanyInvitation = async ({
  email,
}: {
  email: string
}) => {
  try {
    const invitation = await client.organizationInvitation.findUnique({
      where: {
        email,
      },
    })

    // Validation of invitation
    if (!invitation) {
      return null
    }
    const expiresAt = DateTime.fromJSDate(invitation?.expiresAt)

    if (expiresAt < DateTime.now()) {
      // Invitation has expired, so remove it from the database
      await client.organizationInvitation.delete({
        where: {
          email: invitation.email,
        },
      })
      return null
    }

    return invitation
  } catch {
    return null
  }
}
