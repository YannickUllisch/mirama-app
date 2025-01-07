import { auth } from '@auth'
import db from '@db'
import type { Project, User } from '@prisma/client'
import { generateInclude, isTeamAdminOrOwner } from '@src/lib/utils'

export const fetchSingleProjectByName = async (name: string) => {
  const session = await auth()

  const project = await db.project.findFirst({
    where: {
      name,
      teamId: session?.user.teamId,
    },
    include: {
      tasks: {
        include: {
          assignedTo: true,
          tags: true,
        },
      },
      users: {
        include: {
          user: true,
        },
      },
    },
  })

  return project
}

export const fetchSingleProjectById = async (id: string) => {
  const project = await db.project.findFirst({
    where: {
      id,
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      tasks: {
        include: {
          assignedTo: true,
        },
      },
    },
  })

  return project
}

export const fetchAllAssignedProjects = async (archivedStatus?: boolean) => {
  const session = await auth()
  const response = await db.project.findMany({
    where: {
      teamId: session?.user.teamId,
      archived: archivedStatus ? archivedStatus : false,
      users: {
        some: {
          userId: isTeamAdminOrOwner(session) ? undefined : session?.user.id,
        },
      },
    },
    include: {
      tasks: true,
      users: {
        include: {
          user: true,
        },
      },
      expenses: true,
    },
  })

  return response
}

export const fetchAllAssignedProjectsDynamicInclude = async (
  archivedStatus?: boolean,
  rawIncludes?: Record<string, any>,
) => {
  const session = await auth()

  const include = rawIncludes ? generateInclude(rawIncludes, 0, 1) : undefined

  const response = await db.project.findMany({
    where: {
      teamId: session?.user.teamId,
      archived: archivedStatus ? archivedStatus : false,
      users: {
        some: {
          userId: isTeamAdminOrOwner(session) ? undefined : session?.user.id,
        },
      },
    },
    include: include,
  })

  return response
}
