import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@db'
import type { User } from '@prisma/client'
import { getValidCompanyInvitation } from '@src/lib/api/queries/Invite/InviteQueries'

export const CreatePrismaAdapter = () => {
  const adapter = PrismaAdapter(db)

  adapter.createUser = async (user) => {
    const inputUser = user as any as User

    if (!inputUser.name || !inputUser.teamId) {
      // Look up invitation
      const invitation = await getValidCompanyInvitation({
        email: inputUser.email,
      })

      if (!invitation) {
        throw new Error(
          'No invitation for this Email was found. Please contact your administrator',
        )
      }

      // If the invitation is received use the name from it to add to the typedUser (It will be missing otherwise).
      inputUser.name = invitation.name
      inputUser.teamId = invitation.teamId
      inputUser.role = invitation.role
      inputUser.email = invitation.email
    }

    if (!inputUser.name) {
      throw new Error('"name" not defined when creating user')
    }
    if (!inputUser.teamId) {
      throw new Error('"teamId" not defined when creating user')
    }
    if (!inputUser.role) {
      throw new Error('"role" not defined when creating user')
    }

    const createdUser = await db.user.create({
      data: {
        ...inputUser,
      },
    })

    // Deleting invitation in DB for cleanup
    await db.companyInvitation.deleteMany({
      where: {
        email: createdUser.email,
      },
    })

    // TODO: If we wish we could create a new company once we open for public additions

    return createdUser
  }

  return adapter
}
