// app/(app)/organization/[organizationId]/projects/_components/ProjectsContent.tsx
'use client'

import apiRequest from '@hooks'
import { DataTable } from '@src/components/Tables/DataTable'
import { getDaysRemaining } from '@src/modules/pm/projects/projects.helpers'
import {
  type UpdateProjectCommand,
  UpdateProjectCommandSchema,
} from '@src/modules/pm/projects/projects.types'
import { useEditableColumns } from '@src/modules/shared/hooks/utils/useEditableColumns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import type { LucideIcon } from 'lucide-react'
import { Archive, Clock, Euro, Folders } from 'lucide-react'
import { toast } from 'sonner'
import { type ProjectTableRow, useProjectColumns } from '../columns'
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
  <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 min-w-37">
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
  const { items: projects, isLoading: loadingActive } =
    apiRequest.project.fetchAll.useQuery()
  const { mutate: projectMutation } = apiRequest.project.update.useMutation()
  const { mutate: archiveMutation } = apiRequest.project.archive.useMutation()

  const toRow = (p: (typeof projects)[number]): ProjectTableRow => ({
    ...p,
    id: p.projectId,
  })

  const activeList = projects.filter((p) => !p.isArchived).map(toRow)
  const archivedList = projects.filter((p) => p.isArchived).map(toRow)

  const { handleFieldUpdate } = useEditableColumns<
    ProjectTableRow,
    UpdateProjectCommand,
    { id: string; data: UpdateProjectCommand }
  >({
    mutate: projectMutation,
    updateSchema: UpdateProjectCommandSchema,
    getKey: (data) => data.projectId,
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

  const totalBudget = activeList.reduce((sum, p) => sum + (p.budget ?? 0), 0)
  const dueSoon = activeList.filter(
    (p) => p.endDate && getDaysRemaining(new Date(p.endDate)) <= 5,
  ).length

  const activeColumns = useProjectColumns({
    handleFieldUpdate,
    archiveMutation,
  })

  const archivedColumns = useArchivedProjectsColumns({ archiveMutation })

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
              dataLoading={loadingActive}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default ProjectsContent
