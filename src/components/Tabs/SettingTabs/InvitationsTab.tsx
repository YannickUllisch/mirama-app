'use client'
import apiRequest from '@hooks/query'
import { useEditableColumns } from '@hooks/utils/useEditableColumns'
import {
  type InvitationResponseType,
  type UpdateInvitationInput,
  UpdateInvitationSchema,
} from '@server/domain/invitationSchema'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { Plus, UserPlus } from 'lucide-react'
import type { Session } from 'next-auth'
import { toast } from 'sonner'
import { useInvitationColumns } from './helper/InvitationsTabColumns'

const InvitationsTab = ({ session }: { session: Session | null }) => {
  // Hooks
  const { data: invitations, isLoading } =
    apiRequest.invitation.fetchAll.useQuery()
  const { mutate: useUpdateInvitation } =
    apiRequest.invitation.update.useMutation()
  const { mutate: useDeleteInvitation } =
    apiRequest.invitation.delete.useMutation()

  // Update State
  const { handleFieldUpdate } = useEditableColumns<
    InvitationResponseType,
    UpdateInvitationInput
  >({
    mutate: useUpdateInvitation,
    getKey: (data) => data.email,
    updateSchema: UpdateInvitationSchema,
    mapToUpdateInput: (data) => ({
      extendInvitation: true,
      name: data.name,
      role: data.role,
    }),
    onValidationError: (err) => {
      const firstMessage = err.errors?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })

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
          handleFieldUpdate: handleFieldUpdate,
        })}
        data={invitations ?? []}
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
