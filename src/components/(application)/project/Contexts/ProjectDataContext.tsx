'use client'
import type React from 'react'
import { createContext } from 'react'

export const ProjectDataContext = createContext<
  { projectId: string; projectName: string } | undefined
>(undefined)

export const ProjectViewContext = ({
  projectId,
  projectName,
  children,
}: {
  children: React.ReactNode
  projectId: string
  projectName: string
}) => {
  return (
    <ProjectDataContext.Provider value={{ projectId, projectName }}>
      {children}
    </ProjectDataContext.Provider>
  )
}

export default ProjectViewContext
