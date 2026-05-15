// app/(app)/organization/[organizationId]/(management)/teams/_components/TeamSection.tsx
'use client'
import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { TeamResponse } from '@/server/modules/account/teams/features/response'
import apiRequest from '@hooks'
import { ConfirmationDialogWithOpenState } from '@src/components/Dialogs/ConfirmationDialogWithOpenState'
import { DataTable } from '@src/components/Tables/DataTable'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Ellipsis, Trash2, UserPlus, Users2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import AddTeamMemberDialog from './AddTeamMemberDialog'
import type { TeamMemberRow } from './TeamMemberColumns'
import { useTeamMemberColumns } from './TeamMemberColumns'

const TEAM_COLORS = [
  {
    bg: 'bg-signature-coral',
    text: 'text-white',
    muted: 'text-white/70',
    hover: 'hover:bg-white/10',
  },
  {
    bg: 'bg-signature-forest',
    text: 'text-white',
    muted: 'text-white/70',
    hover: 'hover:bg-white/10',
  },
  {
    bg: 'bg-signature-cream',
    text: 'text-ink',
    muted: 'text-ink/60',
    hover: 'hover:bg-ink/10',
  },
  {
    bg: 'bg-signature-peach',
    text: 'text-ink',
    muted: 'text-ink/60',
    hover: 'hover:bg-ink/10',
  },
  {
    bg: 'bg-signature-mint',
    text: 'text-ink',
    muted: 'text-ink/60',
    hover: 'hover:bg-ink/10',
  },
  {
    bg: 'bg-signature-yellow',
    text: 'text-ink',
    muted: 'text-ink/60',
    hover: 'hover:bg-ink/10',
  },
  {
    bg: 'bg-signature-mustard',
    text: 'text-ink',
    muted: 'text-ink/60',
    hover: 'hover:bg-ink/10',
  },
] as const

type TeamSectionProps = {
  team: TeamResponse
  orgMembers: MemberResponse[]
  canUpdate: boolean
  canDelete: boolean
  colorIndex: number
  onDelete: (teamId: string) => void
}

const TeamSection = ({
  team,
  orgMembers,
  canUpdate,
  canDelete,
  colorIndex,
  onDelete,
}: TeamSectionProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)

  const color = TEAM_COLORS[colorIndex % TEAM_COLORS.length]

  const { data: members = [], isLoading: membersLoading } =
    apiRequest.team.members.fetch.useQuery(team.id)

  const { mutate: addMember, isPending: isAdding } =
    apiRequest.team.members.add.useMutation(team.id)

  const { mutate: removeMember } = apiRequest.team.members.remove.useMutation(
    team.id,
  )

  const availableMembers = orgMembers.filter(
    (om) => !members.some((tm) => tm.memberId === om.id),
  )

  const handleRemove = useCallback(
    (memberId: string) => setMemberToRemove(memberId),
    [],
  )

  const memberRows: TeamMemberRow[] = useMemo(
    () => members.map((m) => ({ ...m })),
    [members],
  )

  const columns = useTeamMemberColumns({
    canUpdate,
    onRemove: handleRemove,
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`px-6 py-4 ${color.bg}`}>
        <CardTitle
          className={`text-sm font-medium flex items-center gap-2 ${color.text}`}
        >
          <Users2 className={`w-4 h-4 ${color.muted} shrink-0`} />
          <span className="truncate">{team.name}</span>
          <span className={`text-xs font-normal ${color.muted} ml-1`}>
            {membersLoading ? team.memberCount : members.length}{' '}
            {(membersLoading ? team.memberCount : members.length) === 1
              ? 'member'
              : 'members'}
          </span>

          <div className="ml-auto flex items-center gap-1 shrink-0">
            {canUpdate && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 text-xs gap-1.5 ${color.text} ${color.hover} border-0`}
                onClick={() => setShowAddDialog(true)}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </Button>
            )}

            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${color.text} ${color.hover} border-0`}
                  >
                    <Ellipsis className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive gap-2 focus:text-destructive"
                    onClick={() => onDelete(team.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          tableIdentifier={`team-members-${team.id}`}
          columns={columns}
          data={memberRows}
          dataLoading={membersLoading}
          ignoreSubrows
          footerOptions={{ showPagination: false }}
          toolbarOptions={{ showFilterOption: false }}
        />
      </CardContent>

      <AddTeamMemberDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        availableMembers={availableMembers}
        onAdd={(memberId) =>
          addMember({ memberId }, { onSuccess: () => setShowAddDialog(false) })
        }
        isPending={isAdding}
      />

      <ConfirmationDialogWithOpenState
        key="remove-member-confirmation"
        isOpen={!!memberToRemove}
        title="Remove member from team?"
        description="The member will lose any project access inherited from this team. This cannot be undone."
        onCancel={() => setMemberToRemove(null)}
        onSubmit={() => {
          if (memberToRemove) {
            removeMember(memberToRemove)
            setMemberToRemove(null)
          }
        }}
      />
    </Card>
  )
}

export default TeamSection
