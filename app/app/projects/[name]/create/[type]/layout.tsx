import { TaskType } from '@prisma/client'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create Task',
  description: 'Create a new Task',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string; type: string }>
}) => {
  const awaitedParams = await params

  const validTypes = Object.values(TaskType)
  if (!validTypes.includes(awaitedParams.type.toUpperCase() as TaskType)) {
    notFound()
  }

  return children
}

export default Layout
