'use client'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import PageHeader from '@src/components/PageHeader'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import { Button } from '@ui/button'
import { Plus, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'

const ClientTeamPage = () => {
  // Session
  const { data: session } = useSession()

  // Hooks
  // const { data: members } = apiRequest.team.fetchMembers.useQuery()
  // const { mutate: deleteMember } = apiRequest.team.delete.useMutation()

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

      {/* 
        <MemberAccessTab
          roles={roles}
          organizations={organizations}
          selectedOrgId={selectedOrgId}
          selectedProjectId={selectedProjectId}
          onOrgChange={setSelectedOrgId}
          onProjectChange={setSelectedProjectId}
        /> */}
    </>
  )
}

export default ClientTeamPage
