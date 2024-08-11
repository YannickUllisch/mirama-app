import { db } from '@src/lib/db'
import { auth } from '@src/lib/auth'
import { validateRequest } from '@src/lib/validateRequest'
import { isTeamAdminOrOwner } from '@src/lib/utils'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    // We often only want to fetch either archived or non-archived projects.
    // In the Archive page, we request data from this endpoint. This is done to ensure non-admins can still access their archived projects.
    const archivedStatus = JSON.parse(
      req.nextUrl.searchParams.get('archived') as string,
    )

    // If Team Owner or Admin, all projects should be returned.
    if (isTeamAdminOrOwner(session)) {
      const adminResponse = await db.project.findMany({
        where: {
          teamId: session?.user.teamId,
          archived: archivedStatus ? archivedStatus : false,
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      })

      return Response.json(adminResponse, { status: 200 })
    }

    // If not Admin or Owner Role, only projects the User is linked to should be returned.
    const response = await db.project.findMany({
      where: {
        teamId: session?.user.teamId,
        archived: archivedStatus ? archivedStatus : false,
        users: {
          some: {
            userId: session?.user.id,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
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
