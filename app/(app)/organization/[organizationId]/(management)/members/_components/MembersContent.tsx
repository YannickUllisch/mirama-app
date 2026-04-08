// app/(app)/organization/[organizationId]/(management)/members/_components/MembersContent.tsx
'use client'

import apiRequest from '@hooks/query'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { usePermissions } from '@src/modules/shared/permissions/PermissionContext'
import { Badge } from '@ui/badge'
import {
  Building2,
  ChevronRight,
  FolderKanban,
  ShieldCheck,
} from 'lucide-react'
import { OrgMembersSection, ProjectMembersSection } from './MemberRoleRow'
import type { ProjectWithMembers } from './types'

const MembersContent = () => {
  const { activeOrganizationId } = useOrganizationResource()
  const { can } = usePermissions()

  const canUpdateMember = can('member', 'update')

  const { data: members = [], isLoading: membersLoading } =
    apiRequest.member.fetchByOrg.useQuery(activeOrganizationId)
  const { data: roles = [] } =
    apiRequest.role.fetchAllOrganizationSpecific.useQuery()
  const { data: projects = [] } = apiRequest.project.fetchAll.useQuery()
  const { mutate: updateMember } =
    apiRequest.member.update.useMutation(activeOrganizationId)

  const orgRoles = roles.filter((r) => r.scope === 'ORGANIZATION')

  // Build project member view from project data
  const projectsWithMembers: ProjectWithMembers[] = projects
    .filter((p) => p.members.length > 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      members: p.members.map((pm) => {
        const orgMember = members.find((m) => m.id === pm.id)
        return {
          id: pm.id,
          isManager: pm.isManager,
          member: {
            name: orgMember?.name ?? pm.name,
            email: orgMember?.email ?? pm.email,
          },
        }
      }),
    }))

  const handleOrgRoleChange = (memberId: string, iamRoleId: string) => {
    updateMember({ memberId, data: { iamRoleId } })
  }

  return (
    <div className="space-y-5">
      {/* Hierarchy legend */}
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

      {/* Organization members */}
      <OrgMembersSection
        members={members}
        roles={orgRoles}
        isLoading={membersLoading}
        canUpdate={canUpdateMember}
        onRoleChange={handleOrgRoleChange}
      />

      {/* Project-level members */}
      <ProjectMembersSection projects={projectsWithMembers} />

      {/* Available roles reference */}
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
              <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5">
                {r.scope.toLowerCase()}
              </Badge>
              <span className="text-neutral-400">
                {r.policies.length}{' '}
                {r.policies.length === 1 ? 'policy' : 'policies'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MembersContent
