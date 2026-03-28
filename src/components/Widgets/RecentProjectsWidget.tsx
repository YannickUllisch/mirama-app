import useLocalStorage from '@hooks/utils/useLocalStorage'
import type { ProjectResponse } from '@server/modules/project/features/response'
import { Button } from '@ui/button'
import { Spinner } from '@ui/spinner'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { v4 } from 'uuid'
import ProjectCard from '../Cards/ProjectCard'

const RecentProjectsWidget = ({
  projects,
  isProjectsLoading,
}: {
  projects: ProjectResponse[]
  isProjectsLoading: boolean
}) => {
  const [recentProjectIds, setRecentProjectIds] = useLocalStorage<string[]>(
    'recentProjectIds',
    [],
  )

  return (
    <>
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
        <Link href={'/app/projects/create'} prefetch={false}>
          <Button size="sm" variant={'default'}>
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
              <div
                key={`${v4()}-${index}`}
                className="h-[150px] rounded-lg border border-dashed w-full animate-pulse bg-background p-4 flex flex-col gap-3"
              >
                <div className="h-[30px] rounded-lg w-[100px] animate-pulse bg-white dark:bg-neutral-900" />
                <div className="h-[30px] rounded-lg w-full animate-pulse bg-white dark:bg-neutral-900" />
                <div className="h-[30px] rounded-lg w-full animate-pulse bg-white dark:bg-neutral-900" />
              </div>
            ))}

        {!isProjectsLoading && recentProjectIds.length < 1 ? (
          <span className="text-white/60 tracking-tighter">
            No recent projects found
          </span>
        ) : null}
      </div>
    </>
  )
}

export default RecentProjectsWidget
