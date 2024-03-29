'use client'
import type { Project } from '@prisma/client'
import { NextSeo } from 'next-seo'
import useSWR from 'swr'
import { api } from '@/src/lib/utils'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const ProjectsPage = () => {
  const { data: projects, mutate: updateProjects } = useSWR<Project[]>(
    '/api/project',
    fetcher,
  )

  const deleteProject = async (id: string) => {
    toast.promise(api.delete(`database/project/${id}`), {
      loading: 'Deleting Customer..',
      error: (err) => err.message ?? err,
      success: () => {
        updateProjects((prev) => prev?.filter((project) => project.id !== id))

        return 'Successfully deleted Project'
      },
    })
  }
  return (
    <main className="flex items-center flex-col h-screen">
      <h1 style={{ fontSize: 50, marginTop: 50 }} className="dark:text-white">
        Overview Page
      </h1>
    </main>
  )
}

export default ProjectsPage
