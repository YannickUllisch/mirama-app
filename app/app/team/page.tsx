'use client'
import { Button } from '@src/components/ui/button'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { User } from '@prisma/client'
import { Plus, Users } from 'lucide-react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import UserCard from '@src/components/Avatar/UserCard'

const TeamPage = () => {
  // Session
  const { data: session, update } = useSession()

  // Fetching Data
  const { data: teamMembers, mutate: updateMembers } = useSWR<User[]>(
    '/api/db/team/member',
  )

  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Users width={20} />
        <span style={{ fontSize: 20 }}>Team</span>

        {isTeamAdminOrOwner(session) && (
          <>
            <span>|</span>
            <AddMemberDialog mutate={updateMembers}>
              <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Plus width={15} className="ml-2" />
                <Button
                  style={{ fontSize: 11, textDecoration: 'none' }}
                  variant="link"
                >
                  Add User
                </Button>
              </div>
            </AddMemberDialog>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6">
        {teamMembers?.map((member) => (
          <UserCard
            session={session}
            user={member}
            key={`member-card-${member.id}`}
            mutate={updateMembers}
            updateSession={update}
          />
        ))}
      </div>
    </main>
  )
}

export default TeamPage
