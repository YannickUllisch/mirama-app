'use client'
import type { CompanyInvitation } from '@prisma/client'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { InvitationsTabColumns } from './helper/InvitationsTabColumns'
import { v4 } from 'uuid'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import { Plus } from 'lucide-react'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'

const InvitationsTab = ({ session }: { session: Session | null }) => {
  const {
    data: invitations,
    isLoading,
    mutate,
  } = useSWR<CompanyInvitation[]>('invite')

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
    <DataTable
      tableIdentifier="invitationsTable"
      columns={InvitationsTabColumns({ mutate: mutate })}
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
  )
}

export default InvitationsTab
