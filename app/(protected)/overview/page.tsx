'use client'
import type { Project } from '@prisma/client'
import { NextSeo } from 'next-seo'
import useSWR from 'swr'
import { api, fetcher } from '@/src/lib/utils'
import ProjectsTable from '@/src/components/Tables/ProjectsTable'

const ProjectsPage = () => {
  // const { data: projects, mutate: updateProjects } = useSWR<Project[]>(
  //   '/api/project?id=123',
  //   fetcher,
  // )

  // const deleteProject = async (id: string) => {
  //   toast.promise(api.delete(`database/project/${id}`), {
  //     loading: 'Deleting Customer..',
  //     error: (err) => err.message ?? err,
  //     success: () => {
  //       updateProjects((prev) => prev?.filter((project) => project.id !== id))

  //       return 'Successfully deleted Project'
  //     },
  //   })
  // }
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
