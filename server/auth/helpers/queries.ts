import { PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'

// Initialize a new Client to avoid REDIS caching.
const client = new PrismaClient()

export const getUserById = async (id: string) => {
  try {
    const user = await client.user.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}

export const getValidCompanyInvitation = async ({
  email,
}: { email: string }) => {
  try {
    const invitation = await client.companyInvitation.findUnique({
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
      await client.companyInvitation.delete({
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
