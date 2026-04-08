// app/(app)/organization/[organizationId]/projects/_components/ProjectsTable.tsx
'use client'

import apiRequest from '@hooks/query'
import { useEditableColumns } from '@hooks/utils/useEditableColumns'
import type { ProjectResponse } from '@server/modules/project/features/response'
import {
  type UpdateProjectRequest,
  UpdateProjectSchema,
} from '@server/modules/project/features/update-project/schema'
import { DataTable } from '@src/components/Tables/DataTable'
import { toast } from 'sonner'
import { useProjectColumns } from '../columns'

const ProjectsTable = () => {
  const { data: projects, isLoading } = apiRequest.project.fetchAll.useQuery()
  const { data: users } = apiRequest.team.fetchMembers.useQuery()
  const { mutate: projectMutation } = apiRequest.project.update.useMutation()
  const { mutate: archiveMutation } = apiRequest.project.archive.useMutation()

  const { handleFieldUpdate } = useEditableColumns<
    ProjectResponse,
    UpdateProjectRequest
  >({
    mutate: projectMutation,
    updateSchema: UpdateProjectSchema,
    mapToUpdateInput: (data) => ({
      ...data,
      tags: data.tags.map((t) => t.id),
      newTags: [],
      members: data.members.map((u) => ({
        isManager: u.isManager,
        memberId: u.id,
      })),
    }),
    prepareMutation: (id, data) => ({
      id,
      data,
    }),
    onValidationError: (err) => {
      const firstMessage = err.issues?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })

  return (
    <DataTable
      tableIdentifier="projectPageTable"
      columns={useProjectColumns({
        users: users ?? [],
        handleFieldUpdate,
        archiveMutation,
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
  )
}

export default ProjectsTable
