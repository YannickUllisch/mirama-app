'use server'
import { auth } from '@auth'
import { db } from '@src/lib/db'
import ClientTeamPage from './client'
import { redirect } from 'next/navigation'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'

const TeamPage = async () => {
  // Session
  const session = await auth()

  const members = await fetchAllTeamMembers(session)

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
