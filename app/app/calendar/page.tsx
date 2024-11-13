'use server'
import CalendarClientPage from './client'
import { auth } from '@auth'
import { redirect } from 'next/navigation'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'

const CalendarPage = async () => {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const projects = await fetchAllAssignedProjects(false)

  return <CalendarClientPage key={'client-calendar-page'} projects={projects} />
}

export default CalendarPage
