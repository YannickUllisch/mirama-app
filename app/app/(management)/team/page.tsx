'use client'
import type { User } from '@prisma/client'
import UserCard from '@src/components/Avatar/UserCard'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import PageHeader from '@src/components/PageHeader'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { Button } from '@ui/button'
import { Plus, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

const ClientTeamPage = () => {
  // Session
  const { data: session, update } = useSession()

  // Fetching Data
  const { data: teamMembers, mutate: updateMembers } =
    useSWR<User[]>('team/member')

  return (
    <>
      <PageHeader title="Team" description="View your Team." icon={Users}>
        {isTeamAdminOrOwner(session) && (
          <AddMemberDialog>
            <Button size={'sm'} variant={'secondary'} className="w-30">
              <Plus width={15} />
              <span>Add User</span>
            </Button>
          </AddMemberDialog>
        )}
      </PageHeader>

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
