'use client'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import {
  type UpdateInvitationRequest,
  UpdateInvitationSchema,
} from '@/server/modules/account/invitations/features/update-invitation/schema'
import apiRequest from '@hooks/query'
import { useEditableColumns } from '@src/modules/shared/hooks/utils/useEditableColumns'
import type { OrganizationRole } from '@prisma/client'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import { Plus, UserPlus } from 'lucide-react'
import type { Session } from 'next-auth'
import { toast } from 'sonner'
import { useInvitationColumns } from './helper/InvitationsTabColumns'

const InvitationsTab = ({ session }: { session: Session | null }) => {
  // Hooks
  const { data: invitations, isLoading } =
    apiRequest.invitation.fetchAll.useQuery()
  const { mutate: updateInvitationMutation } =
    apiRequest.invitation.update.useMutation()
  const { mutate: useDeleteInvitation } =
    apiRequest.invitation.delete.useMutation()

  // Update State
  const { handleFieldUpdate } = useEditableColumns<
    InvitationResponse,
    UpdateInvitationRequest
  >({
    mutate: updateInvitationMutation,
    getKey: (data) => data.email,
    updateSchema: UpdateInvitationSchema,
    mapToUpdateInput: (data) => ({
      extendInvitation: true,
      name: data.name,
      organizationRole: data.organizationRole as OrganizationRole,
    }),
    prepareMutation: (email, data) => ({
      email,
      data,
    }),
    onValidationError: (err) => {
      const firstMessage = err.issues?.[0]?.message || 'Input Error'
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
          addToolbarleft: isOrgAdminOrOwner(session) && (
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
