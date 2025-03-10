import type { Metadata } from 'next'
import { auth } from '@auth'
import { redirect } from 'next/navigation'
import { TaskType } from '@prisma/client'
import db from '@db'

export const metadata: Metadata = {
  title: 'Create Task',
  description: 'Create a new Task',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { name: string; type: string }
}) => {
  const session = await auth()

  const project = await db.project.findFirst({
    where: {
      name: params.name,
      teamId: session?.user.teamId ?? 'undef',
    },
    select: {
      id: true,
    },
  })

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${params.name}/create/${params.type}`,
    )
  }

  const validTypes = Object.values(TaskType)
  if (!validTypes.includes(params.type.toUpperCase() as TaskType)) {
    redirect(`/app/${params.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return children
}

export default Layout
