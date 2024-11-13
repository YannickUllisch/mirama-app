'use server'
import { redirect } from 'next/navigation'
import React from 'react'
import CreateTaskForm from './client'
import { auth } from '@auth'
import { fetchSingleProjectById } from '@src/lib/api/queries/Project/ProjectQuerys'
import { fetchAllTeamTags } from '@src/lib/api/queries/Tags/TagQueries'

const CreateTaskPage = async ({
  params,
}: { params: { name: string; projectId: string } }) => {
  const session = await auth()

  const project = await fetchSingleProjectById(params.projectId)
  const tags = await fetchAllTeamTags(session)

  if (!project) {
    redirect(`/app/${params.name}`)
  }

  return (
    <main className="flex flex-col">
      <CreateTaskForm project={project} tags={tags} projName={project.name} />
    </main>
  )
}

export default CreateTaskPage
