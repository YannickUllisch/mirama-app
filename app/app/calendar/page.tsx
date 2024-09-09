'use server'
import { db } from '@src/lib/db'
import CalendarClientPage from './client'
import { auth } from '@src/lib/auth'
import { redirect } from 'next/navigation'
import { isTeamAdminOrOwner } from '@src/lib/utils'

const CalendarPage = async () => {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
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
  })
  return <CalendarClientPage key={'client-calendar-page'} projects={projects} />
}

export default CalendarPage
