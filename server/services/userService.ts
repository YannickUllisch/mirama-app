import db from '@db'
import type { Role } from '@prisma/client'
import type { UpdateUserinput } from '@server/domain/userSchema'
import { isRoleHigher } from '@src/lib/utils'

/**
 * Fetches all users based on teamId
 * @param teamId Users team ID
 * @returns Array of users sorted by ascending
 */
const getUsersByTeam = async (teamId: string) => {
  return await db.user.findMany({ where: { teamId }, orderBy: { role: 'asc' } })
}

/**
 * Deletes Users in Bulk
 * @param ids Array of Ids for users to delete (bulk request)
 * @param sessionRole Role of requestee needed for permission check
 * @param teamId TeamId of all users
 */
const deleteUsers = async (
  ids: string[],
  sessionRole: Role,
  teamId: string,
) => {
  const usersToDelete = await db.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  // Check if any user has a higher role
  if (usersToDelete.some((user) => isRoleHigher(user.role, sessionRole))) {
    throw new Error('Action not Allowed')
  }

  await db.user.deleteMany({
    where: { id: { in: ids }, teamId },
  })
}

/**
 * Updates user if role allows.
 * @param userId User to update ID
 * @param sessionRole Role of the user performing the update
 * @param teamId Team id for requestee and user to be updated
 * @param input Update Data for User Model
 */
const updateUser = async (
  userId: string,
  sessionRole: Role,
  teamId: string,
  input: UpdateUserinput,
) => {
  const userToUpdate = await db.user.findFirst({ where: { id: userId } })

  if (!userToUpdate) throw new Error('User could not be found')

  // If the user to update has higher role han the requestee, deny request
  if (isRoleHigher(userToUpdate.role, sessionRole))
    throw new Error('Action not Allowed')

  if (input.role && isRoleHigher(input.role, sessionRole))
    throw new Error('Action not Allowed')

  const updatedUser = await db.user.update({
    where: {
      id: userId,
      teamId,
    },
    data: {
      ...input,
      id: undefined,
    },
  })

  return updatedUser
}

export const UserService = {
  getUsersByTeam,
  deleteUsers,
  updateUser,
}
