'use server'
import { redirect, useSearchParams } from 'next/navigation'
import React from 'react'
import CreateTaskForm from './client'
import { db } from '@src/lib/db'
import { auth } from '@src/lib/auth'

const CreateTaskPage = async ({
  params,
}: { params: { name: string; projectId: string } }) => {
  const session = await auth()

  const project = await db.project.findFirst({
    where: {
      id: params.projectId,
      teamId: session?.user.teamId,
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      tasks: {
        include: {
          assignedTo: true,
        },
      },
      taskCategories: true,
    },
  })

  const tags = await db.tag.findMany({
    where: {
      teamId: session?.user.teamId,
    },
  })

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
