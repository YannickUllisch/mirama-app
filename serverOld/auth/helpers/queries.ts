import { PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'

// Initialize a new Client to avoid REDIS caching.
const client = new PrismaClient()

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

export const tryGetOrganization = async (memberId: string, orgId: string) => {
  const organization = await client.organization.findFirst({
    where: {
      id: orgId,
      members: {
        some: {
          id: memberId,
        },
      },
    },
    select: {
      id: true,
      tenantId: true,
      members: {
        where: {
          id: memberId,
        },
        select: {
          role: true,
        },
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
