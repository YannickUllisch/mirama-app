import { PrismaAdapter } from '@auth/prisma-adapter'
import { Role, type User } from '@prisma/client'
import db from '@server/utils/db'
import { getValidCompanyInvitation } from '../helpers/queries'

export const CreatePrismaAdapter = () => {
  const adapter = PrismaAdapter(db)
  adapter.getUser = async (id) => {
    const dbUser = await db.user.findUnique({ where: { id } })
    if (!dbUser) {
      console.warn(`No user found in DB for id: ${id}`)
    }
    return dbUser
  }
  adapter.createUser = async (user) => {
    const inputUser = user as any as User

    const invitation = await getValidCompanyInvitation({
      email: inputUser.email,
    })

    if (invitation) {
      // If the invitation is received use the name from it to add to the typedUser
      inputUser.teamId = invitation.teamId
      inputUser.role = invitation.role
      inputUser.email = invitation.email
      inputUser.name = invitation.name
    } else {
      // Otherwise create a new Team
      const newTeam = await db.team.create({
        data: {
          name: inputUser.name ?? 'My Team',
        },
      })
      inputUser.teamId = newTeam.id
      inputUser.role = Role.ADMIN
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
        id: inputUser.id,
        email: inputUser.email,
        name: inputUser.name,
        teamId: inputUser.teamId,
        role: inputUser.role,
        emailVerified: new Date(),
      },
    })

    // Deleting invitation in DB for cleanup
    await db.companyInvitation.deleteMany({
      where: {
        email: createdUser.email,
      },
    })

    return createdUser
  }

  return adapter
}
