import type { MemberResponse } from '@server/modules/account/members/features/response'
import type { RoleResponse } from '@server/modules/account/roles/features/response'
import { Badge } from '@ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { Skeleton } from '@ui/skeleton'
import { FolderKanban, ShieldCheck, Users } from 'lucide-react'
import type { ProjectWithMembers } from './types'

const MemberRoleRow = ({
  member,
  roles,
  canUpdate,
  onRoleChange,
}: {
  member: MemberResponse
  roles: RoleResponse[]
  canUpdate: boolean
  onRoleChange: (roleId: string) => void
}) => (
  <div className="flex items-center justify-between gap-4 px-4 py-2.5">
    <div className="min-w-0">
      <p className="text-sm font-medium truncate">{member.name}</p>
      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
        {member.organizationRole}
      </Badge>
      {canUpdate ? (
        <Select value={member.iamRoleId ?? ''} onValueChange={onRoleChange}>
          <SelectTrigger className="h-7 text-xs w-40">
            <SelectValue placeholder="No IAM role" />
          </SelectTrigger>
          <SelectContent>
            {roles
              .filter((r) => r.scope === 'ORGANIZATION')
              .map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    {r.name}
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-xs text-muted-foreground">
          {roles.find((r) => r.id === member.iamRoleId)?.name ?? 'No role'}
        </span>
      )}
    </div>
  </div>
)

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

export const ProjectMembersSection = ({
  projects,
}: {
  projects: ProjectWithMembers[]
}) => {
  if (projects.length === 0) return null

  return (
    <>
      {projects.map((project) => (
        <section
          key={project.id}
          className="border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
            <FolderKanban className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-semibold">{project.name}</span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 ml-auto"
            >
              project members
            </Badge>
            <span className="text-xs text-muted-foreground">
              {project.members.length}
            </span>
          </div>
          <div className="divide-y divide-border/60">
            {project.members.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No members assigned to this project.
              </div>
            ) : (
              project.members.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between gap-4 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {pm.member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {pm.member.email}
                    </p>
                  </div>
                  {pm.isManager && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 shrink-0"
                    >
                      Manager
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      ))}
    </>
  )
}
