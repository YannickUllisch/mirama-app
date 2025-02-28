'use client'
import type { Milestone, Project, User } from '@prisma/client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import useSWR from 'swr'
import { projectTabs } from './tabs'
import ProjectHeader from '@src/components/Header/ProjectHeader'

const ClientProjectPage = () => {
  const projectContext = useContext(ProjectDataContext)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')
  const [tab, setTab] = useState(currentTab ?? 'overview')

  const { data: project } = useSWR<Project & { milestones: Milestone[] }>({
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

  useEffect(() => {
    if (currentTab !== tab) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('tab', tab)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [tab, currentTab, pathname, searchParams, router])

  const upcomingMilestone = useMemo(() => {
    return project?.milestones
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending
      .find((milestone) => new Date(milestone.date) >= new Date())
  }, [project?.milestones])

  return (
    <>
      <ProjectHeader
        project={project}
        users={users}
        upcomingMilestone={upcomingMilestone}
      />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex w-full items-center gap-4 dark:text-white rounded-lg h-10 relative overflow-x-auto">
          {/* Tabs List */}
          <TabsList className="absolute  inline-flex items-center whitespace-nowrap sm:justify-center sm:gap-2 w-auto">
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
        {/* Tab Content */}
        {projectTabs.map((tab) => (
          <TabsContent value={tab.id} key={`${tab.id}-tab`}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

export default ClientProjectPage
