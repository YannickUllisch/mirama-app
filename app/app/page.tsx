'use server'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { auth } from '@auth'
import { db } from '@src/lib/db'
import ClientAppPage from './client'
import { redirect } from 'next/navigation'

const AppHomePage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/signin?callbackUrl=/app')
  }

  const projects = await db.project.findMany({
    where: {
      teamId: session?.user.teamId,
      archived: false,
      users: {
        some: {
          userId: isTeamAdminOrOwner(session) ? undefined : session?.user.id,
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

  return <ClientAppPage session={session} projects={projects} />
}

export default AppHomePage
