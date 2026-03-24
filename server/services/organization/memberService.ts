import type { OrganizationRole } from '@prisma/client'
import type { UpdateMemberType } from '@server/domain/memberSchema'
import { MemberMapper } from '@server/mapping/organization/memberMapping'
import db from '@server/utils/db'
import { isRoleHigher } from '@src/lib/utils'

export const MemberService = {
  /**
   * Fetches all members based on organizationId
   * @param organizationId Users team ID
   * @returns Array of members sorted by ascending
   */
  getMembersByTeam: async (organizationId: string) => {
    const res = await db.member.findMany({
      where: { organizationId },
      orderBy: { role: 'asc' },
    })

    return res.map((r) => MemberMapper.mapDefaultToApi(r))
  },

  /**
   * Deletes User
   * @param id ID for member to delete
   * @param sessionRole Role of requestee needed for permission check
   * @param organizationId TeamId of all members
   */
  deleteUser: async (
    id: string,
    sessionRole: OrganizationRole,
    organizationId: string,
  ) => {
    const memberToDelete = await db.member.findFirst({
      where: {
        id,
      },
    })

    if (!memberToDelete) {
      throw new Error('User could not be found')
    }

    // Check if any member has a higher role
    if (isRoleHigher(memberToDelete.role, sessionRole)) {
      throw new Error('Action not Allowed')
    }

    await db.member.deleteMany({
      where: { id: id, organizationId },
    })
  },

  /**
   * Updates member if role allows.
   * @param memberId User to update ID
   * @param sessionRole Role of the member performing the update
   * @param organizationId Team id for requestee and member to be updated
   * @param input Update Data for User Model
   */
  updateUser: async (
    memberId: string,
    sessionRole: OrganizationRole,
    organizationId: string,
    input: UpdateMemberType,
  ) => {
    const memberToUpdate = await db.member.findFirst({
      where: { id: memberId },
    })

    if (!memberToUpdate) throw new Error('User could not be found')

    // If the member to update has higher role han the requestee, deny request
    if (isRoleHigher(memberToUpdate.role, sessionRole))
      throw new Error('Action not Allowed')

    if (
      input.organizationRole &&
      isRoleHigher(input.organizationRole, sessionRole)
    )
      throw new Error('Action not Allowed')

    const updatedUser = await db.member.update({
      where: {
        id: memberId,
        organizationId,
      },
      data: {
        ...input,
        id: undefined,
      },
    })

    return updatedUser
  },
}
