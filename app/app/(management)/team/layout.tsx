import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'

export const metadata: Metadata = {
  title: 'Team | Mirama',
  description: 'Overview of Team',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  const members = await fetchAllTeamMembers(session)

  if (!session?.user) {
    return redirect('/auth/login?callbackUrl=/app/team')
  }

  const fallbackData = {
    '/api/db/team/member': members,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
