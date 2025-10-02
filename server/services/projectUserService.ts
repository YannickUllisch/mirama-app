import db from '@db'
import type { UpdateProjectUsersInput } from '@server/domain/projectUserSchema'

const getProjectUserJoinsByProject = async (
  projectId: string,
  teamId: string,
) => {
  return await db.projectUser.findMany({
    where: { projectId, project: { teamId } },
    include: { user: true },
  })
}

const updateProjectUserJoin = async (
  projectId: string,
  userId: string,
  input: UpdateProjectUsersInput,
  isAdminOrOwner: boolean,
) => {
  // 1. Permission check
  const existingProjectUser = await db.projectUser.findFirst({
    where: { projectId, userId },
    select: { isManager: true },
  })

  if (!isAdminOrOwner && !existingProjectUser?.isManager) {
    throw new Error('Invalid Permission')
  }

  // 2. Fetch current state once
  const currentUsers = await db.projectUser.findMany({
    where: { projectId },
    select: { id: true, userId: true, isManager: true },
  })

  const inputUserSet = new Set(input.userIds)
  const currentUserSet = new Set(currentUsers.map((u) => u.userId))

  // Build queries array to execute in transaction
  const queries: any[] = []

  if (input.setAsManagers) {
    // Upsert managers
    for (const uid of input.userIds) {
      queries.push(
        db.projectUser.upsert({
          where: { projectId_userId: { projectId, userId: uid } },
          create: { projectId, userId: uid, isManager: true },
          update: { isManager: true },
        }),
      )
    }

    // Downgrade removed managers
    for (const cu of currentUsers) {
      if (cu.isManager && !inputUserSet.has(cu.userId)) {
        queries.push(
          db.projectUser.update({
            where: { id: cu.id },
            data: { isManager: false },
          }),
        )
      }
    }
  } else {
    // Remove users not in input
    for (const cu of currentUsers) {
      if (!inputUserSet.has(cu.userId)) {
        queries.push(
          db.projectUser.delete({
            where: { id: cu.id },
          }),
        )
      }
    }

    // Add new users
    for (const uid of input.userIds) {
      if (!currentUserSet.has(uid)) {
        queries.push(
          db.projectUser.create({
            data: { projectId, userId: uid, isManager: false },
          }),
        )
      }
    }
  }

  // Execute all changes atomically
  if (queries.length > 0) {
    await db.$transaction(queries)
  }
}

export const ProjectUserService = {
  getProjectUserJoinsByProject,
  updateProjectUserJoin,
}
