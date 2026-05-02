// app/(app)/organization/[organizationId]/projects/_components/ProjectsContent.tsx
'use client'

import apiRequest from '@hooks'
import type { ProjectResponse } from '@server/modules/project/features/response'
import {
  type UpdateProjectRequest,
  UpdateProjectSchema,
} from '@server/modules/project/features/update-project/schema'
import { ConfirmationDialogWithOpenState } from '@src/components/Dialogs/ConfirmationDialogWithOpenState'
import { DataTable } from '@src/components/Tables/DataTable'
import { getDaysRemaining } from '@src/modules/project/_helpers'
import { useEditableColumns } from '@src/modules/shared/hooks/utils/useEditableColumns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import type { LucideIcon } from 'lucide-react'
import { Archive, Clock, Euro, Folders } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useProjectColumns } from '../columns'
import { useArchivedProjectsColumns } from './ArchivedProjectsColumns'

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: boolean
}) => (
  <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 min-w-[148px]">
    <div
      className={`p-1.5 rounded-lg shrink-0 ${accent ? 'bg-primary/10' : 'bg-muted'}`}
    >
      <Icon
        className={`w-4 h-4 ${accent ? 'text-primary' : 'text-text-secondary'}`}
      />
    </div>
    <div className="min-w-0">
      <div
        className={`text-base font-bold leading-none tabular-nums ${accent ? 'text-primary' : 'text-foreground'}`}
      >
        {value}
      </div>
      <div className="text-[11px] text-text-secondary mt-0.5 whitespace-nowrap">
        {label}
      </div>
    </div>
  </div>
)

const ProjectsContent = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: projects, isLoading: loadingActive } =
    apiRequest.project.fetchAll.useQuery()
  const { data: archivedProjects, isLoading: loadingArchived } =
    apiRequest.project.fetchArchived.useQuery()
  const { data: users } = apiRequest.members.fetchAll.useQuery()
  const { mutate: projectMutation } = apiRequest.project.update.useMutation()
  const { mutate: archiveMutation } = apiRequest.project.archive.useMutation()
  const { mutate: deleteMutation } = apiRequest.project.delete.useMutation()

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
      members: data.members.map((u) => ({ memberId: u.id })),
    }),
    prepareMutation: (id, data) => ({ id, data }),
    onValidationError: (err) => {
      const firstMessage = err.issues?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })

  const activeList = projects ?? []
  const archivedList = archivedProjects ?? []

  const totalBudget = activeList.reduce((sum, p) => sum + (p.budget ?? 0), 0)
  const dueSoon = activeList.filter(
    (p) => getDaysRemaining(new Date(p.endDate)) <= 5,
  ).length

  const activeColumns = useProjectColumns({
    users: users ?? [],
    handleFieldUpdate,
    archiveMutation,
  })

  const archivedColumns = useArchivedProjectsColumns({
    archiveMutation,
    users: users ?? [],
    setSelectedId,
  })

  return (
    <>
      <div className="flex items-center gap-3 px-6 md:px-10 py-4 overflow-x-auto">
        <StatCard
          label="Active Projects"
          value={activeList.length}
          icon={Folders}
        />
        <StatCard label="Archived" value={archivedList.length} icon={Archive} />
        <StatCard
          label="Due Soon"
          value={dueSoon}
          icon={Clock}
          accent={dueSoon > 0}
        />
        <StatCard
          label="Total Budget"
          value={`€${totalBudget.toLocaleString()}`}
          icon={Euro}
        />
      </div>

      <div className="px-6 md:px-10 pb-6">
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="gap-1.5">
              Active
              {activeList.length > 0 && (
                <span className="text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-semibold tabular-nums">
                  {activeList.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              Archived
              {archivedList.length > 0 && (
                <span className="text-[10px] bg-muted text-text-secondary rounded-full px-1.5 py-0.5 font-semibold tabular-nums">
                  {archivedList.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <DataTable
              tableIdentifier="projectPageTable"
              columns={activeColumns}
              data={activeList}
              dataLoading={loadingActive}
              toolbarOptions={{ showFilterOption: true }}
              footerOptions={{ showPagination: true }}
            />
          </TabsContent>

          <TabsContent value="archived">
            <DataTable
              tableIdentifier="archivedTable"
              toolbarOptions={{ showFilterOption: true }}
              footerOptions={{ showPagination: true }}
              expandedContent
              columns={archivedColumns}
              data={archivedList}
              dataLoading={loadingArchived}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmationDialogWithOpenState
        isOpen={!!selectedId}
        key="confirmation-dialog-deletion"
        title="Are you sure?"
        description="Deleting a project cannot be undone. All associated data will be lost."
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

export default ProjectsContent
