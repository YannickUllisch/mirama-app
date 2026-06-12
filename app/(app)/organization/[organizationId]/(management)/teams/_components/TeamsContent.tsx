// app/(app)/organization/[organizationId]/(management)/teams/_components/TeamsContent.tsx
'use client'
import apiRequest from '@hooks'
import { ConfirmationDialogWithOpenState } from '@src/components/Dialogs/ConfirmationDialogWithOpenState'
import { usePermissions } from '@src/modules/tenant/iam/PermissionContext'
import { Button } from '@ui/button'
import { Plus, Users2 } from 'lucide-react'
import { useState } from 'react'
import CreateTeamDialog from './CreateTeamDialog'
import TeamSection from './TeamSection'

const TeamsContent = () => {
  const { can } = usePermissions()

  const canCreate = can('team', 'create')
  const canUpdate = can('team', 'update')
  const canDelete = can('team', 'delete')

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)

  const { data: teams = [], isLoading } = apiRequest.team.fetchAll.useQuery()
  const { data: orgMembers = [] } = apiRequest.members.fetchAll.useQuery()

  const { mutate: createTeam, isPending: isCreating } =
    apiRequest.team.create.useMutation()

  const { mutate: deleteTeam } = apiRequest.team.remove.useMutation()

  return (
    <div className="px-6 md:px-10 py-10 space-y-5">
      {/* Top action bar */}
      <div className="flex items-center justify-end">
        {canCreate && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            New Team
          </Button>
        )}
      </div>

      {/* Empty state */}
      {!isLoading && teams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users2 className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground">No teams yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-xs">
            Create a team to group members and assign them to projects together.
          </p>
          {canCreate && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Create first team
            </Button>
          )}
        </div>
      )}

      {/* Team cards */}
      {teams.map((t, index) => (
        <TeamSection
          key={t.id}
          team={t}
          orgMembers={orgMembers}
          canUpdate={canUpdate}
          canDelete={canDelete}
          colorIndex={index}
          onDelete={setTeamToDelete}
        />
      ))}

      {/* Create Team dialog */}
      <CreateTeamDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={(data) =>
          createTeam(data, { onSuccess: () => setShowCreateDialog(false) })
        }
        isPending={isCreating}
      />

      {/* Delete Team confirmation */}
      <ConfirmationDialogWithOpenState
        key="delete-team-confirmation"
        isOpen={!!teamToDelete}
        title="Delete team?"
        description="This will permanently remove the team and revoke any project access members inherited through it. This cannot be undone."
        onCancel={() => setTeamToDelete(null)}
        onSubmit={() => {
          if (teamToDelete) {
            deleteTeam(teamToDelete)
            setTeamToDelete(null)
          }
        }}
      />
    </div>
  )
}

export default TeamsContent
