'use client'
import apiRequest from '@hooks/query'
import { ConfirmationDialogWithOpenState } from '@src/components/Dialogs/ConfirmationDialogWithOpenState'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { ArchiveIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useArchivedProjectsColumns } from './columns'

const ArchivePage = () => {
  const { data: session } = useSession()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Hooks
  const { data: projects, isLoading } =
    apiRequest.project.fetchArchived.useQuery()
  const { mutate: useArchiveMutation } =
    apiRequest.project.archive.useMutation()
  const { mutate: deleteMutation } = apiRequest.project.delete.useMutation()
  const { data: users } = apiRequest.members.fetchAll.useQuery()

  return (
    <>
      <PageHeader
        title="Archive"
        description="Archived projects overview"
        icon={ArchiveIcon}
      />
      <DataTable
        tableIdentifier="archivedTable"
        toolbarOptions={{
          showFilterOption: true,
        }}
        footerOptions={{ showPagination: true }}
        expandedContent
        columns={useArchivedProjectsColumns({
          archiveMutation: useArchiveMutation,
          session: session,
          users: users ?? [],
          setSelectedId: setSelectedId,
        })}
        data={projects ?? []}
        dataLoading={isLoading}
      />

      <ConfirmationDialogWithOpenState
        isOpen={!!selectedId}
        key={'confirmation-dialog-deletion'}
        title="Are you sure?"
        description="Deleting a project can not be undone. All associated data will be lost. Are you sure you want to proceed?"
        onCancel={() => setSelectedId(null)}
        onSubmit={() => {
          if (selectedId) {
            deleteMutation(selectedId)
            setSelectedId(null)
          } else {
            toast.error('Error on Delete..')
          }
        }}
      />
    </>
  )
}

export default ArchivePage
