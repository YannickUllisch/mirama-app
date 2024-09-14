'use server'
import { auth } from '@auth'
import { db } from '@src/lib/db'
import ClientTeamPage from './client'
import { redirect } from 'next/navigation'

const TeamPage = async () => {
  // Session
  const session = await auth()

  const members = await db.user.findMany({
    where: {
      teamId: session?.user.teamId,
    },
  })

  if (!session) {
    redirect('')
  }
  return (
    <main className="flex flex-col">
      <ClientTeamPage session={session} teamMembers={members} />
    </main>
  )
}

export default TeamPage
