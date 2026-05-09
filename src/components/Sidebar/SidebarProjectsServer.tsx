// src/components/Sidebar/SidebarProjectsServer.tsx
import { auth } from '@auth'
import { ProjectRepository } from '@server/modules/project/infrastructure/project.repo'
import { getScopedDb } from '@scopedDb'
import SidebarProjectsList from './SidebarProjectsList'

export type SidebarProject = {
  id: string
  name: string
  taskCount: number
}

const SidebarProjectsServer = async ({
  organizationId,
  tenantId,
}: {
  organizationId: string
  tenantId: string
}) => {
  const session = await auth()
  if (!session?.user.memberId) return null

  const db = getScopedDb(tenantId, organizationId)
  const rows = await ProjectRepository(db).findForSidebar({
    memberId: session.user.memberId,
  })

  const projects: SidebarProject[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    taskCount: p._count.tasks,
  }))

  return (
    <SidebarProjectsList organizationId={organizationId} projects={projects} />
  )
}

export default SidebarProjectsServer
