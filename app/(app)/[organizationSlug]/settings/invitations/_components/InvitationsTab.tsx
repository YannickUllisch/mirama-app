// app/(app)/organization/[organizationSlug]/settings/invitations/_components/InvitationsTab.tsx
'use client'

import PageHeader from '@src/components/PageHeader'
import { UserPlus } from 'lucide-react'
import type { Session } from 'next-auth'

const InvitationsTab = ({ session }: { session: Session | null }) => {
  // // Hooks
  // const { data: invitations, isLoading } =
  //   apiRequest.invitation.fetchAll.useQuery()
  // const { mutate: updateInvitationMutation } =
  //   apiRequest.invitation.update.useMutation()
  // const { mutate: useDeleteInvitation } =
  //   apiRequest.invitation.delete.useMutation()

  // Update State
  // const { handleFieldUpdate } = useEditableColumns<
  //   InvitationResponse,
  //   UpdateInvitationRequest
  // >({
  //   mutate: updateInvitationMutation,
  //   getKey: (data) => data.email,
  //   updateSchema: UpdateInvitationSchema,
  //   mapToUpdateInput: (data) => ({
  //     extendInvitation: true,
  //     name: data.name,
  //     iamRoleId: '',
  //   }),
  //   prepareMutation: (email, data) => ({
  //     email,
  //     data,
  //   }),
  //   onValidationError: (err) => {
  //     const firstMessage = err.issues?.[0]?.message || 'Input Error'
  //     toast.error(`Input Error: ${firstMessage}`)
  //   },
  // })

  return (
    <>
      <PageHeader
        icon={UserPlus}
        title="Team Invitations"
        description="View and manage Team Invitations"
      />
      {/* <DataTable
        tableIdentifier="invitationsTable"
        columns={useInvitationColumns({
          deleteMutation: null! useDeleteInvitation,
          session: session,
          handleFieldUpdate: handleFieldUpdate,
        })}
        data={[]}
        dataLoading={isLoading}
        toolbarOptions={{
          showFilterOption: true,
          addToolbarleft: (
            <AddMemberDialog>
              <div className="flex px-3 gap-2 items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Plus width={15} />
                <span className="text-xs">Invite</span>
              </div>
            </AddMemberDialog>
          ),
        }}
      /> */}
    </>
  )
}

export default InvitationsTab
