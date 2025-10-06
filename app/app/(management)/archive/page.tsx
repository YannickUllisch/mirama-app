'use client'
import apiRequest from '@hooks/query'
import {} from '@server/domain/projectSchema'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { ArchiveIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useArchivedProjectsColumns } from './columns'

const ArchivePage = () => {
  const { data: session } = useSession()

  // Hooks
  const { data: projects, isLoading } =
    apiRequest.project.fetchArchived.useQuery()
  const { mutate: useArchiveMutation } =
    apiRequest.project.archive.useMutation()
  const { mutate: useDeleteMutation } = apiRequest.project.delete.useMutation()
  const { data: users } = apiRequest.team.fetchMembers.useQuery()

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
          deleteMutation: useDeleteMutation,
          session: session,
          users: users ?? [],
        })}
        data={projects ?? []}
        dataLoading={isLoading}
      />
    </>
  )
}

export default ArchivePage
