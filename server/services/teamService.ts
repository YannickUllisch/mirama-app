import db from '@db'
import type { Role } from '@prisma/client'
import type { UpdateUserType } from '@server/domain/userSchema'
import { UserMapper } from '@server/mapping/user/userMapping'
import { isRoleHigher } from '@src/lib/utils'

/**
 * Fetches all users based on teamId
 * @param teamId Users team ID
 * @returns Array of users sorted by ascending
 */
const getUsersByTeam = async (teamId: string) => {
  const res = await db.user.findMany({
    where: { teamId },
    orderBy: { role: 'asc' },
  })

  return res.map((r) => UserMapper.mapDefaultToApi(r))
}

/**
 * Deletes User
 * @param id ID for user to delete
 * @param sessionRole Role of requestee needed for permission check
 * @param teamId TeamId of all users
 */
const deleteUser = async (id: string, sessionRole: Role, teamId: string) => {
  const userToDelete = await db.user.findFirst({
    where: {
      id,
    },
  })

  if (!userToDelete) {
    throw new Error('User could not be found')
  }

  // Check if any user has a higher role
  if (isRoleHigher(userToDelete.role, sessionRole)) {
    throw new Error('Action not Allowed')
  }

  await db.user.deleteMany({
    where: { id: id, teamId },
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
  input: UpdateUserType,
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
  deleteUser,
  updateUser,
}
