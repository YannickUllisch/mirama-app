'use client'
import apiRequest from '@hooks/query'
import { useEditableColumns } from '@hooks/utils/useEditableColumns'
import {
  type ProjectResponseInput,
  type UpdateProjectInput,
  UpdateProjectSchema,
} from '@server/domain/projectSchema'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { Folders } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useProjectColumns } from './columns'

const ProjectsPage = () => {
  // Session
  const { data: session } = useSession({ required: true })

  // Hooks
  const { data: projects, isLoading } = apiRequest.project.fetchAll.useQuery()
  const { data: users } = apiRequest.team.fetchMembers.useQuery()
  const { mutate: projectMutation } = apiRequest.project.update.useMutation()
  const { mutate: useArchiveMutation } =
    apiRequest.project.archive.useMutation()
  const { mutate: useDeleteMutation } = apiRequest.project.delete.useMutation()
  // Column Update handler
  const { handleFieldUpdate } = useEditableColumns<
    ProjectResponseInput,
    UpdateProjectInput
  >({
    mutate: projectMutation,
    updateSchema: UpdateProjectSchema,
    mapToUpdateInput: (data) => ({
      ...data,
      tags: data.tags.map((t) => t.id),
      users: data.users.map((u) => ({
        isManager: u.isManager,
        userId: u.id,
      })),
    }),
    onValidationError: (err) => {
      const firstMessage = err.errors?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })

  return (
    <>
      <PageHeader
        title="Your Projects"
        description="Manage your projects"
        icon={Folders}
      />
      <DataTable
        tableIdentifier="projectPageTable"
        columns={useProjectColumns({
          session: session,
          users: users ?? [],
          handleFieldUpdate,
          archiveMutation: useArchiveMutation,
          deleteMutation: useDeleteMutation,
        })}
        data={projects ?? []}
        dataLoading={isLoading}
        toolbarOptions={{
          showFilterOption: true,
        }}
        footerOptions={{
          showPagination: true,
        }}
      />
    </>
  )
}

export default ProjectsPage
