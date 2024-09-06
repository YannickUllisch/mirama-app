'use client'
import type { User } from '@prisma/client'
import UserCard from '@src/components/Avatar/UserCard'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import { Button } from '@src/components/ui/button'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { Plus, Users } from 'lucide-react'
import type { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'

const ClientTeamPage = ({
  session,
  teamMembers,
}: { session: Session; teamMembers: User[] }) => {
  // Fetching Data
  const { data: clientTeamMembers, mutate: updateMembers } = useSWR<User[]>(
    '/api/db/team/member',
  )
  const { update } = useSession()
  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Users width={20} />
        <span style={{ fontSize: 20 }}>Team</span>
        {isTeamAdminOrOwner(session) && (
          <>
            <span>|</span>
            <AddMemberDialog>
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
        {clientTeamMembers
          ? clientTeamMembers.map((member) => (
              <UserCard
                session={session}
                user={member}
                key={`member-card-${member.id}`}
                mutate={updateMembers}
                updateSession={update}
              />
            ))
          : teamMembers.map((member) => (
              <UserCard
                session={session}
                user={member}
                key={`member-card-${member.id}`}
                mutate={updateMembers}
                updateSession={update}
              />
            ))}
      </div>
    </>
  )
}

export default ClientTeamPage
