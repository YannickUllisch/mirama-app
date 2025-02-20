'use client'
import type { User } from '@prisma/client'
import UserCard from '@src/components/Avatar/UserCard'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { Plus, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'

const ClientTeamPage = () => {
  // Session
  const { data: session, update } = useSession()

  // Fetching Data
  const { data: teamMembers, mutate: updateMembers } =
    useSWR<User[]>('team/member')

  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Users width={20} />
        <span style={{ fontSize: 20 }}>Team</span>
        {isTeamAdminOrOwner(session) && (
          <>
            <span>|</span>
            <AddMemberDialog>
              <div className="flex gap-2 items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Plus width={15} className="ml-2" />
                <span className="text-xs">Add User</span>
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
    </>
  )
}

export default ClientTeamPage
