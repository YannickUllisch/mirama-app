'use client'

import apiRequest from '@hooks'
import { DataTable } from '@src/components/Tables/DataTable'
import { usePermissions } from '@src/modules/tenant/iam/PermissionContext'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { Badge } from '@ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { ShieldCheck } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import MembersSubNav from './MembersSubNav'
import { useOrgMemberColumns } from './OrgMembersColumns'
import type { ProjectMemberRow } from './ProjectMembersColumns'
import { useProjectMemberColumns } from './ProjectMembersColumns'

interface MembersContentProps {
  view: 'organization' | 'projects'
}

const MembersContent = ({ view }: MembersContentProps) => {
  const { can } = usePermissions()
  const canUpdateMember = can('member', 'update')

  const { items: members, isLoading: membersLoading } =
    apiRequest.members.fetchAll.useQuery()
  const { data: roles = [] } =
    apiRequest.role.fetchAllByScopeForOrganization.useQuery(
      AccessScope.Organization,
    )
  const { items: projects } = apiRequest.project.fetchAll.useQuery()
  const { mutate: updateMember } = apiRequest.members.update.useMutation()

  const handleOrgRoleChange = useCallback(
    (memberId: string, iamRoleId: string) => {
      updateMember({ memberId, data: { iamRoleId } })
    },
    [updateMember],
  )

  const projectsWithMembers = useMemo(
    () =>
      projects
        .filter((p) => p.members.length > 0)
        .map((p) => ({
          id: p.id,
          name: p.name,
          members: p.members.map((pm) => {
            const orgMember = members.find((m) => m.id === pm.memberId)
            return {
              id: pm.memberId,
              member: {
                name: orgMember?.name,
                email: orgMember?.email,
              },
            }
          }),
        })),
    [projects, members],
  )

  const projectRows: ProjectMemberRow[] = useMemo(
    () =>
      projectsWithMembers.flatMap((p, projectIdx) =>
        p.members.map((pm) => ({
          id: `${p.id}::${pm.id}`,
          memberName: pm.member.name ?? '',
          memberEmail: pm.member.email ?? '',
          projectName: p.name,
          projectId: p.id,
          projectColorIndex: projectIdx,
        })),
      ),
    [projectsWithMembers],
  )

  const projectOptions = useMemo(
    () => projectsWithMembers.map((p) => ({ label: p.name, value: p.name })),
    [projectsWithMembers],
  )

  const orgColumns = useOrgMemberColumns({
    roles,
    canUpdate: canUpdateMember,
    onRoleChange: handleOrgRoleChange,
  })

  const projectColumns = useProjectMemberColumns({ projectOptions })

  return (
    <div className="px-6 md:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8 items-start">
        <div className="min-w-0">
          <MembersSubNav />

          {view === 'organization' ? (
            <DataTable
              tableIdentifier="members-org"
              columns={orgColumns}
              data={members}
              dataLoading={membersLoading}
              ignoreSubrows
              footerOptions={{ showPagination: true }}
              toolbarOptions={{ showFilterOption: true }}
            />
          ) : (
            <DataTable
              tableIdentifier="members-projects"
              columns={projectColumns}
              data={projectRows}
              ignoreSubrows
              footerOptions={{ showPagination: true }}
              toolbarOptions={{ showFilterOption: true }}
            />
          )}
        </div>

        {/* Right: sticky roles reference panel */}
        <div className="lg:sticky lg:top-6">
          <Card className="overflow-hidden">
            <CardHeader className="px-5 py-4 bg-surface-dark">
              <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white/70" />
                Available Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {roles.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No roles defined.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start gap-3 px-5 py-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {r.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1 py-0 h-3.5"
                          >
                            {r.scope.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MembersContent
