'use client'
import { addProjectIdToLocalStorage } from '@/app/app/_helpers'
import Loading from '@/app/loading'
import apiRequest from '@hooks/query'
import useLocalStorage from '@hooks/utils/useLocalStorage'
import { OrganizationRole } from '@prisma/client'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import ProjectHeader from '@src/components/Header/ProjectHeader'
import BoardTab from '@src/components/Tabs/ProjectTabs/BoardTab'
import ListTab from '@src/components/Tabs/ProjectTabs/ListTab'
import OverviewTab from '@src/components/Tabs/ProjectTabs/OverviewTab'
import TableTab from '@src/components/Tabs/ProjectTabs/TableTab'
import GanttTab from '@src/components/Tabs/ProjectTabs/TimelineTab'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import {
  ClipboardList,
  GanttChart,
  ListTodo,
  MapIcon,
  Table2,
} from 'lucide-react'
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

const ClientProjectPage = () => {
  // Context for ProjectId and Name
  const projectContext = useContext(ProjectDataContext)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams?.get('tab')
  const [tab, setTab] = useState(currentTab ?? 'overview')

  // Hooks
  const { data: project, isLoading } = apiRequest.project.fetchById.useQuery(
    projectContext?.projectId ?? '',
  )
  const { data: tasks } = apiRequest.task.fetchByProject.useQuery(
    projectContext?.projectId ?? '',
  )
  const { data: users } = apiRequest.team.fetchMembers.useQuery()

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

  const tabs = useMemo(() => {
    return [
      {
        id: 'overview',
        roles: Object.values(OrganizationRole),
        component: (
          <OverviewTab project={project ?? null} tasks={tasks ?? []} />
        ),
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <MapIcon width={15} /> Overview
          </div>
        ),
      },
      {
        id: 'table',
        roles: Object.values(OrganizationRole),
        component: (
          <TableTab
            project={project ?? null}
            tasks={tasks ?? []}
            users={users ?? []}
          />
        ),
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <Table2 width={15} /> Table
          </div>
        ),
      },
      {
        id: 'list',
        roles: Object.values(OrganizationRole),
        component: <ListTab project={project ?? null} tasks={tasks ?? []} />,
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <ListTodo width={15} /> List
          </div>
        ),
      },
      {
        id: 'kanban',
        roles: Object.values(OrganizationRole),
        component: (
          <BoardTab
            project={project ?? null}
            tasks={tasks ?? []}
            users={users ?? []}
          />
        ),
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <ClipboardList width={15} /> Board
          </div>
        ),
      },
      {
        id: 'timeline',
        roles: Object.values(OrganizationRole),
        component: <GanttTab project={project ?? null} tasks={tasks ?? []} />,
        headerComponent: (
          <div className="flex justify-center gap-1 items-center">
            <GanttChart width={15} /> Timeline
          </div>
        ),
      },
    ]
  }, [project, tasks, users])

  if (isLoading) {
    return <Loading />
  }

  if (!project) {
    notFound()
  }

  return (
    <>
      <ProjectHeader project={project} upcomingMilestone={upcomingMilestone} />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex w-full items-center shadow-md dark:shadow-neutral-800 bg-background rounded-lg h-[50px] gap-4 dark:text-white relative overflow-x-auto">
          <TabsList className="absolute inline-flex items-center whitespace-nowrap sm:justify-center sm:gap-2 w-auto">
            {tabs.map((tabHeader) => (
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
          {tabs.map((tab) => (
            <TabsContent value={tab.id} key={`${tab.id}-tab`}>
              {tab.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </>
  )
}

export default ClientProjectPage
