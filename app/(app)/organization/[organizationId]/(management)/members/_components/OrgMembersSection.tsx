import type { MemberResponse } from '@server/modules/account/members/features/response'
import type { RoleResponse } from '@server/modules/account/roles/features/response'
import { Badge } from '@ui/badge'
import { Skeleton } from '@ui/skeleton'
import { Users } from 'lucide-react'
import { MemberRoleRow } from './MemberRoleRow'

export const OrgMembersSection = ({
  members,
  roles,
  isLoading,
  canUpdate,
  onRoleChange,
}: {
  members: MemberResponse[]
  roles: RoleResponse[]
  isLoading: boolean
  canUpdate: boolean
  onRoleChange: (memberId: string, roleId: string) => void
}) => (
  <section className="border border-border rounded-xl overflow-hidden">
    <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
      <Users className="w-4 h-4 text-neutral-400" />
      <span className="text-sm font-semibold">Organization Members</span>
      <Badge
        variant="secondary"
        className="text-[10px] px-1.5 py-0 h-4 ml-auto"
      >
        org-level role
      </Badge>
      {!isLoading && (
        <span className="text-xs text-muted-foreground">{members.length}</span>
      )}
    </div>
    <div className="divide-y divide-border/60">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-44 ml-auto" />
          </div>
        ))
      ) : members.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No members in this organization.
        </div>
      ) : (
        members.map((m) => (
          <MemberRoleRow
            key={m.id}
            member={m}
            roles={roles}
            canUpdate={canUpdate}
            onRoleChange={(roleId) => onRoleChange(m.id, roleId)}
          />
        ))
      )}
    </div>
  </section>
)
