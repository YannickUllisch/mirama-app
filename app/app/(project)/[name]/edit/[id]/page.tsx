'use server'
import { auth } from '@auth'
import { db } from '@src/lib/db'
import { redirect } from 'next/navigation'
import EditTaskForm from './client'
import { fetchAllTeamTags } from '@src/lib/api/queries/Tags/TagQueries'
import { fetchSingleProjectByName } from '@src/lib/api/queries/Project/ProjectQuerys'
import { fetchTaskById } from '@src/lib/api/queries/Tasks/TaskQueries'

const EditTaskPage = async ({
  params,
}: { params: { name: string; id: string } }) => {
  const session = await auth()

  const tags = await fetchAllTeamTags(session)
  const project = await fetchSingleProjectByName(params.name)
  const task = await fetchTaskById(params.id)

  if (!task) {
    redirect(`/app/${params.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return (
    <main className="flex flex-col">
      <EditTaskForm
        project={project}
        tags={tags}
        task={task}
        projName={project.name}
      />
    </main>
  )
}

export default EditTaskPage
