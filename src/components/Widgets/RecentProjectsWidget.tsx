import type { Project, Task } from '@prisma/client'
import { Button } from '@ui/button'
import { Spinner } from '@ui/spinner'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProjectCard from '../../pages/dashboard/project/ProjectCard'
import { Card } from '@ui/card'
import { Skeleton } from '@ui/skeleton'
import useLocalStorage from '@src/hooks/useLocalStorage'

const RecentProjectsWidget = ({
  projects,
  isProjectsLoading,
}: {
  projects: (Project & { tasks: Task[] })[]
  isProjectsLoading: boolean
}) => {
  const [recentProjectIds, setRecentProjectIds] = useLocalStorage<string[]>(
    'recentProjectIds',
    [],
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span>Recent Projects</span>
          {projects && !isProjectsLoading ? (
            <span className="text-sm px-2 py-0.5 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 rounded-full">
              {recentProjectIds.length}
            </span>
          ) : (
            <Spinner className="bg-text" />
          )}
        </h2>
        <Link href={'/app/project/create'} prefetch={false}>
          <Button
            size="sm"
            className="gap-1 bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isProjectsLoading && projects
          ? recentProjectIds.map((projectId) => {
              // Need to validate that the ID stored in localstorage still exists, otherwise it will throw an error
              const existingProject = projects.find(
                (proj) => proj.id === projectId,
              )
              return existingProject ? (
                <ProjectCard
                  project={existingProject}
                  key={projectId}
                  setRecentProjectIds={setRecentProjectIds}
                />
              ) : null
            })
          : Array.from({ length: 4 }).map((_, index) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="border border-dashed flex items-center justify-center h-[150px] bg-background"
              >
                <Skeleton className="h-[150px] w-full" />
              </Card>
            ))}

        {!isProjectsLoading && recentProjectIds.length < 1 ? (
          <span className="text-white/60 tracking-tighter">
            No recent projects found
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default RecentProjectsWidget
