'use client'
import type { User } from '@prisma/client'
import type React from 'react'
import { createContext } from 'react'

export const ProjectDataContext = createContext<
  { users: User[]; projectId: string; projectName: string } | undefined
>(undefined)

const ProjectUsersContext = ({
  users,
  projectId,
  projectName,
  children,
}: {
  users: User[]
  children: React.ReactNode
  projectId: string
  projectName: string
}) => {
  return (
    <ProjectDataContext.Provider value={{ users, projectId, projectName }}>
      {children}
    </ProjectDataContext.Provider>
  )
}

export default ProjectUsersContext
