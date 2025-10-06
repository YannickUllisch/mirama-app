'use client'
import apiRequest from '@hooks/query'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { Plus, UserPlus } from 'lucide-react'
import type { Session } from 'next-auth'
import { useMemo } from 'react'
import { v4 } from 'uuid'
import { useInvitationColumns } from './helper/InvitationsTabColumns'

const InvitationsTab = ({ session }: { session: Session | null }) => {
  // Hooks
  const { data: invitations, isLoading } =
    apiRequest.invitation.fetchAll.useQuery()
  const { mutate: useUpdateInvitation } =
    apiRequest.invitation.update.useMutation()
  const { mutate: useDeleteInvitation } =
    apiRequest.invitation.delete.useMutation()

  // Problem is that DataTable expects an ID which is not given in the
  // CompanyInvitation type.
  const revisedInvitations = useMemo(() => {
    if (invitations) {
      return invitations?.map((inv) => {
        return {
          ...inv,
          id: v4(),
        }
      })
    }

    return []
  }, [invitations])

  return (
    <>
      <PageHeader
        icon={UserPlus}
        title="Team Invitations"
        description="View and manage Team Invitations"
      />
      <DataTable
        tableIdentifier="invitationsTable"
        columns={useInvitationColumns({
          deleteMutation: useDeleteInvitation,
          session: session,
          updateMutation: useUpdateInvitation,
        })}
        data={revisedInvitations ?? []}
        dataLoading={isLoading}
        toolbarOptions={{
          showFilterOption: true,
          addToolbarleft: isTeamAdminOrOwner(session) && (
            <AddMemberDialog>
              <div className="flex px-3 gap-2 items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Plus width={15} />
                <span className="text-xs">Invite</span>
              </div>
            </AddMemberDialog>
          ),
        }}
      />
    </>
  )
}

export default InvitationsTab
