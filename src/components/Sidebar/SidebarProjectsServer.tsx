// src/components/Sidebar/SidebarProjectsServer.tsx
import { auth } from '@auth'
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

  const projects: SidebarProject[] = []

  return (
    <SidebarProjectsList organizationId={organizationId} projects={projects} />
  )
}

export default SidebarProjectsServer
