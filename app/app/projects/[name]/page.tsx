'use client'
import { addProjectIdToLocalStorage } from '@/app/app/_helpers'
import Loading from '@/app/loading'
import useLocalStorage from '@hooks/utils/useLocalStorage'
import type { Milestone, Project, User } from '@prisma/client'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import ProjectHeader from '@src/components/Header/ProjectHeader'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { projectTabs } from './_tabs'

const ClientProjectPage = () => {
  const projectContext = useContext(ProjectDataContext)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams?.get('tab')
  const [tab, setTab] = useState(currentTab ?? 'overview')

  const { data: project, isLoading } = useSWR<
    Project & { milestones: Milestone[] }
  >({
    url: projectContext ? `project/${projectContext.projectId}` : undefined,
    select: {
      startDate: true,
      endDate: true,
      priority: true,
      status: true,
      archived: true,
      name: true,
      milestones: true,
    },
  })

  const { data: users } = useSWR<User[]>(
    projectContext ? `project/users?id=${projectContext.projectId}` : undefined,
  )

  // Handling Project visit, by storing the project id in local storage (used to show recent projects)
  const [_, setRecentProjects] = useLocalStorage<string[]>(
    'recentProjectIds',
    [],
  )
  const hasStoredProject = useRef(false)
  useEffect(() => {
    if (project && !hasStoredProject.current) {
      addProjectIdToLocalStorage(setRecentProjects, project.id)
      hasStoredProject.current = true // Mark as stored so it doesn't run again
    }
  }, [project, setRecentProjects])

  // Handling Tab updates in URL
  useEffect(() => {
    if (currentTab !== tab) {
      const newParams = new URLSearchParams(searchParams as any)
      newParams.set('tab', tab)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [tab, currentTab, pathname, searchParams, router])

  const upcomingMilestone = useMemo(() => {
    return project?.milestones
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending
      .find((milestone) => new Date(milestone.date) >= new Date())
  }, [project?.milestones])

  if (isLoading) {
    return <Loading />
  }

  if (!project) {
    notFound()
  }

  return (
    <>
      <ProjectHeader
        project={project}
        users={users}
        upcomingMilestone={upcomingMilestone}
      />

      <div className="rounded-lg">
        <Tabs value={tab} onValueChange={setTab} className="w-full ">
          <div className="flex w-full items-center shadow-md dark:shadow-neutral-800  bg-background rounded-lg h-[50px] gap-4 dark:text-white relative overflow-x-auto">
            {/* Tabs List */}
            <TabsList className="absolute inline-flex items-center whitespace-nowrap sm:justify-center sm:gap-2 w-auto">
              {projectTabs.map((tabHeader) => (
                <TabsTrigger
                  style={{ fontSize: 12 }}
                  value={tabHeader.id}
                  key={tabHeader.id}
                >
                  {tabHeader.headerComponent}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="p-3">
            {/* Tab Content */}
            {projectTabs.map((tab) => (
              <TabsContent value={tab.id} key={`${tab.id}-tab`}>
                {tab.component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  )
}

export default ClientProjectPage
