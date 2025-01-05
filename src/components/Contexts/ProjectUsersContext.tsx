'use client'
import type { User } from '@prisma/client'
import type React from 'react'
import { createContext } from 'react'

export const ProjectDataContext = createContext<{ users: User[] } | undefined>(
  undefined,
)

const ProjectUsersContext = ({
  users,
  children,
}: { users: User[]; children: React.ReactNode }) => {
  return (
    <ProjectDataContext.Provider value={{ users }}>
      {children}
    </ProjectDataContext.Provider>
  )
}

export default ProjectUsersContext
