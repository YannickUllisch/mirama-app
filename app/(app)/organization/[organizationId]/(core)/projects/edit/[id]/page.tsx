'use client'
import EditProjectForm from '@src/modules/pm/projects/components/EditProjectForm'
import { use } from 'react'

const EditProjectPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  return <EditProjectForm projectId={id} />
}

export default EditProjectPage
