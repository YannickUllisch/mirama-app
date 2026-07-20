'use client'

import apiRequest from '@hooks'
import { DataTable } from '@src/components/Tables/DataTable'
import {
  type ProjectResponse,
  type UpdateProjectCommand,
  UpdateProjectCommandSchema,
} from '@src/modules/pm/projects/projects.types'
import { useEditableColumns } from '@src/modules/shared/hooks/utils/useEditableColumns'
import { toast } from 'sonner'
import { useProjectColumns } from '../columns'

const ProjectsTable = () => {
  const { items: projects, isLoading } = apiRequest.project.fetchAll.useQuery()
  const { mutate: projectMutation } = apiRequest.project.update.useMutation()
  const { mutate: archiveMutation } = apiRequest.project.archive.useMutation()

  const rows = projects.filter((p) => !p.isArchived)

  const { handleFieldUpdate } = useEditableColumns<
    ProjectResponse,
    UpdateProjectCommand,
    { id: string; data: UpdateProjectCommand }
  >({
    mutate: projectMutation,
    updateSchema: UpdateProjectCommandSchema,
    mapToUpdateInput: (data) => ({
      name: data.name,
      description: data.description ?? null,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      statusId: data.statusId,
      priorityId: data.priorityId,
      budget: data.budget,
      tagIds: data.tagIds,
    }),
    prepareMutation: (id, data) => ({ id, data }),
    onValidationError: (err) => {
      const firstMessage = err.issues?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })

  return (
    <DataTable
      tableIdentifier="projectPageTable"
      columns={useProjectColumns({ handleFieldUpdate, archiveMutation })}
      data={rows}
      dataLoading={isLoading}
      toolbarOptions={{ showFilterOption: true }}
      footerOptions={{ showPagination: true }}
    />
  )
}

export default ProjectsTable
