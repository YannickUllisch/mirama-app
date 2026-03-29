'use client'
import apiRequest from '@hooks/query'
import UserCard from '@src/components/Avatar/UserCard'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import PageHeader from '@src/components/PageHeader'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import { Button } from '@ui/button'
import { Plus, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'

const ClientTeamPage = () => {
  // Session
  const { data: session, update } = useSession()

  // Hooks
  const { data: members } = apiRequest.team.fetchMembers.useQuery()
  const { mutate: deleteMember } = apiRequest.team.delete.useMutation()

  return (
    <>
      <PageHeader title="Team" description="View your Team." icon={Users}>
        {isOrgAdminOrOwner(session) && (
          <AddMemberDialog>
            <Button size={'sm'} variant={'secondary'} className="w-30">
              <Plus width={15} />
              <span>Add User</span>
            </Button>
          </AddMemberDialog>
        )}
      </PageHeader>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6">
        {members?.map((member) => (
          <UserCard
            session={session}
            user={member}
            key={`member-card-${member.id}`}
            updateSession={update}
            deleteMember={deleteMember}
          />
        ))}
      </div>
    </>
  )
}

export default ClientTeamPage
