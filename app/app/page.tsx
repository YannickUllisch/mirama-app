'use server'
import { auth } from '@auth'
import ClientAppPage from './client'
import { redirect } from 'next/navigation'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'

const AppHomePage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/signin?callbackUrl=/app')
  }

  const projects = await fetchAllAssignedProjects()

  return <ClientAppPage session={session} projects={projects} />
}

export default AppHomePage
