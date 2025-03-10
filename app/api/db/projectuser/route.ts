import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import db from '@db'
import { isTeamAdminOrOwner } from '@src/lib/utils'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const projectId = req.nextUrl.searchParams.get('projectId') as string
    if (!projectId) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await db.projectUser.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    })

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})

export const PUT = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const projectId = req.nextUrl.searchParams.get('id') as string

    if (!projectId) {
      return Response.json(
        { ok: false, message: 'Project ID is required in Request' },
        { status: 404 },
      )
    }

    // Validating if user is allowed to update Projectuser Model.
    const existingProjectUser = await db.projectUser.findFirst({
      where: {
        projectId,
        userId: session?.user.id,
      },
    })

    if (!isTeamAdminOrOwner(session) && !existingProjectUser?.isManager) {
      return Response.json(
        { ok: false, message: 'Invalid Permission' },
        { status: 403 },
      )
    }

    const body = (await req.json()) as {
      userIds: string[]
      setAsManagers: boolean | undefined
    }

    if (!body?.userIds) {
      return Response.json(
        { ok: false, message: 'Expected User IDs in body' },
        { status: 404 },
      )
    }

    // Updating projectuser records linked to given ProjectId based on the input userIds.
    const currentlyLinkedUsers = await db.projectUser.findMany({
      where: {
        projectId,
      },
    })

    // Different conditions whether or not we want to update Managers or add users to Project in general
    if (body.setAsManagers) {
      await db.$transaction(
        body.userIds.map((id) =>
          db.projectUser.upsert({
            where: {
              projectId_userId: {
                projectId,
                userId: id,
              },
            },
            create: {
              projectId,
              userId: id,
              isManager: true,
            },
            update: {
              isManager: true,
            },
          }),
        ),
      )
      // In addition to updating existing records, we need to check if any Managers have been removed
      // In that case we just remove them as a mangager, we do not remove the link entirely
      const usersToRemove = currentlyLinkedUsers.filter(
        (user) =>
          user.isManager && !body.userIds.some((id) => id === user.userId),
      )

      // Update operations to downgrade managers
      if (usersToRemove.length > 0) {
        await db.$transaction(
          usersToRemove.map((projectUser) =>
            db.projectUser.update({
              where: {
                id: projectUser.id,
              },
              data: {
                isManager: false,
              },
            }),
          ),
        )
      }

      return Response.json(
        { ok: true, message: 'Managers Successfully Updated' },
        { status: 200 },
      )
    }

    // If not Manager select we want to add or remove users to a project
    const usersToRemove = currentlyLinkedUsers.filter(
      (user) => !body.userIds.some((id) => id === user.userId),
    )

    const usersToCreate = body.userIds.filter(
      (id) => !currentlyLinkedUsers.some((user) => user.userId === id),
    )

    if (usersToRemove.length > 0) {
      await Promise.all(
        usersToRemove.map((projectUser) =>
          db.projectUser.delete({
            where: {
              id: projectUser.id,
            },
          }),
        ),
      )
    }

    if (usersToCreate.length > 0) {
      await Promise.all(
        usersToCreate.map((id) =>
          db.projectUser.create({
            data: {
              isManager: false,
              projectId,
              userId: id,
            },
          }),
        ),
      )
    }

    return Response.json(
      { ok: true, message: 'Successfully Updated' },
      { status: 200 },
    )
    // Updating Actual ProjectUser model based on the given users from the body.
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
