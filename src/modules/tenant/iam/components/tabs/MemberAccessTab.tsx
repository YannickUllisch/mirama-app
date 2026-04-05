'use client'

import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { OrganizationListResponse } from '@/server/modules/account/organizations/features/response'
import type { RoleResponse } from '@/server/modules/account/roles/features/response'
import apiRequest from '@hooks/query'
import { Badge } from '@ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { Skeleton } from '@ui/skeleton'
import {
  Building2,
  ChevronRight,
  FolderKanban,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { IamScope } from '../../types'

type Props = {
  scope: IamScope
  roles: RoleResponse[]
  organizations: OrganizationListResponse[]
  selectedOrgId: string
  selectedProjectId: string
  onOrgChange: (id: string) => void
  onProjectChange: (id: string) => void
}

const MemberRoleRow = ({
  member,
  roles,
  onRoleChange,
}: {
  member: MemberResponse
  roles: RoleResponse[]
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
      <Select value={member.iamRoleId ?? ''} onValueChange={onRoleChange}>
        <SelectTrigger className="h-7 text-xs w-40">
          <SelectValue placeholder="No IAM role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r.id} value={r.id} className="text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-primary" />
                {r.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
)

const OrgMembersSection = ({
  organizationId,
  roles,
}: {
  organizationId: string
  roles: RoleResponse[]
}) => {
  const { data: members = [], isLoading } =
    apiRequest.member.fetchByOrg.useQuery(organizationId)
  const { mutate: updateMember } =
    apiRequest.member.update.useMutation(organizationId)

  return (
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
          <span className="text-xs text-muted-foreground">
            {members.length}
          </span>
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
              onRoleChange={(roleId) =>
                updateMember({ memberId: m.id, data: { iamRoleId: roleId } })
              }
            />
          ))
        )}
      </div>
    </section>
  )
}

export const MemberAccessTab = ({
  scope,
  roles,
  organizations,
  selectedOrgId,
  selectedProjectId,
  onOrgChange,
  onProjectChange,
}: Props) => {
  const isFixed = scope.type === 'project'

  // Only fetch org projects when an org is selected (and not in fixed project mode)
  const { data: orgProjects = [] } =
    apiRequest.organization.fetchProjectsByOrg.useQuery(
      isFixed ? '' : selectedOrgId,
    )

  return (
    <div className="space-y-5">
      {/* ── Scope selectors (hidden in project-settings mode) ── */}
      {!isFixed && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-border bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex-1 min-w-40 space-y-1">
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
              Organization
            </p>
            <Select value={selectedOrgId} onValueChange={onOrgChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select organization…" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    <span className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      {o.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-40 space-y-1">
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
              Project{' '}
              <span className="normal-case font-normal">(optional)</span>
            </p>
            <Select
              value={selectedProjectId}
              onValueChange={onProjectChange}
              disabled={!selectedOrgId}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="All projects…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All projects</SelectItem>
                {orgProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="flex items-center gap-2">
                      <FolderKanban className="w-3.5 h-3.5 text-neutral-400" />
                      {p.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {!selectedOrgId && !isFixed ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
          <Building2 className="w-8 h-8 mb-3 text-neutral-300 dark:text-neutral-700" />
          <p className="text-sm">
            Select an organization to view member roles.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── Hierarchy legend ── */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Organization role
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="flex items-center gap-1">
              <FolderKanban className="w-3.5 h-3.5" />
              Project role
              <span className="text-neutral-300 dark:text-neutral-600 ml-1">
                (overrides org role for that project)
              </span>
            </span>
          </div>

          {/* Organization-level members ─ */}
          <OrgMembersSection
            organizationId={
              isFixed && scope.type === 'project'
                ? scope.organizationId
                : selectedOrgId
            }
            roles={roles}
          />

          {/* Available roles reference  */}
          <section>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              Available Roles
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-neutral-50/50 dark:bg-neutral-900/50 text-xs"
                >
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span className="font-mono font-medium">{r.name}</span>
                  {!r.tenantId && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 h-3.5"
                    >
                      system
                    </Badge>
                  )}
                  <span className="text-neutral-400">
                    {r.policies.length}{' '}
                    {r.policies.length === 1 ? 'policy' : 'policies'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
