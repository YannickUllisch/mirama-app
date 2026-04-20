// app/(app)/organization/[organizationId]/(management)/teams/_components/TeamsContent.tsx
'use client'
import apiRequest from '@hooks'
import { ConfirmationDialogWithOpenState } from '@src/components/Dialogs/ConfirmationDialogWithOpenState'
import teamHooks from '@src/modules/organization/teams/hooks/hooks'
import { usePermissions } from '@src/modules/shared/permissions/PermissionContext'
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

  const { data: teams = [], isLoading } = teamHooks.fetchAll.useQuery()

  // Org members are fetched once here and passed down so each TeamSection
  // can filter the add-member dropdown without additional requests.
  const { data: orgMembers = [] } = apiRequest.members.fetchAll.useQuery()

  const { mutate: createTeam, isPending: isCreating } =
    teamHooks.create.useMutation()

  const { mutate: deleteTeam } = teamHooks.remove.useMutation()

  return (
    <div className="space-y-5">
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
          <Users2 className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mb-3" />
          <p className="text-sm font-semibold text-neutral-500">No teams yet</p>
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

      {/* Team sections — each fetches its own members independently */}
      {teams.map((t) => (
        <TeamSection
          key={t.id}
          team={t}
          orgMembers={orgMembers}
          canUpdate={canUpdate}
          canDelete={canDelete}
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
