// app/(app)/organization/[organizationId]/(management)/teams/_components/TeamSection.tsx
'use client'
import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { TeamResponse } from '@/server/modules/account/teams/features/response'
import { ConfirmationDialogWithOpenState } from '@src/components/Dialogs/ConfirmationDialogWithOpenState'
import { cn } from '@src/lib/utils'
import teamHooks from '@src/modules/organization/teams/hooks/hooks'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Skeleton } from '@ui/skeleton'
import {
  ChevronDown,
  Ellipsis,
  Trash2,
  UserPlus,
  Users2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import AddTeamMemberDialog from './AddTeamMemberDialog'

type TeamSectionProps = {
  team: TeamResponse
  orgMembers: MemberResponse[]
  canUpdate: boolean
  canDelete: boolean
  onDelete: (teamId: string) => void
}

const TeamSection = ({
  team,
  orgMembers,
  canUpdate,
  canDelete,
  onDelete,
}: TeamSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)

  const { data: members = [], isLoading: membersLoading } =
    teamHooks.members.fetch.useQuery(team.id)

  const { mutate: addMember, isPending: isAdding } =
    teamHooks.members.add.useMutation(team.id)

  const { mutate: removeMember } =
    teamHooks.members.remove.useMutation(team.id)

  // Only show org members not already in this team
  const availableMembers = orgMembers.filter(
    (om) => !members.some((tm) => tm.memberId === om.id),
  )

  const displayCount = membersLoading ? team.memberCount : members.length

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      {/* Team header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
        <Users2 className="w-4 h-4 text-neutral-400 shrink-0" />
        <span className="text-sm font-semibold truncate">{team.name}</span>
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 h-4 shrink-0"
        >
          {displayCount} {displayCount === 1 ? 'member' : 'members'}
        </Badge>

        <div className="ml-auto flex items-center gap-1 shrink-0">
          {canUpdate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1.5"
              onClick={() => setShowAddDialog(true)}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Member
            </Button>
          )}

          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
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

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'rotate-180',
              )}
            />
          </Button>
        </div>
      </div>

      {/* Members body */}
      {isExpanded && (
        <div className="divide-y divide-border/60">
          {membersLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            ))
          ) : members.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No members in this team.{' '}
              {canUpdate && (
                <button
                  type="button"
                  onClick={() => setShowAddDialog(true)}
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Add the first one
                </button>
              )}
            </div>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {m.email}
                  </p>
                </div>
                {canUpdate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setMemberToRemove(m.memberId)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Member dialog */}
      <AddTeamMemberDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        availableMembers={availableMembers}
        onAdd={(memberId) =>
          addMember(
            { memberId },
            { onSuccess: () => setShowAddDialog(false) },
          )
        }
        isPending={isAdding}
      />

      {/* Remove Member confirmation */}
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
    </section>
  )
}

export default TeamSection
