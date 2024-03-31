'use client'
import type { Project } from '@prisma/client'
import { NextSeo } from 'next-seo'
import useSWR from 'swr'
import { api, fetcher } from '@/src/lib/utils'
import ProjectsTable from '@/src/components/Tables/ProjectsTable'

const ProjectsPage = () => {
  return (
    <main className="flex items-center flex-col h-screen">
      <h1 style={{ fontSize: 50, marginTop: 50 }} className="dark:text-white">
        Overview Page
      </h1>
      <ProjectsTable />
    </main>
  )
}

export default ProjectsPage
