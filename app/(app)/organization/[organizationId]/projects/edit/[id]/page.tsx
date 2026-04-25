// app/(app)/organization/[organizationId]/projects/edit/[id]/page.tsx
'use client'
import ProjectForm from '@src/modules/project/components/ProjectForm'
import { use } from 'react'

const EditProjectPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  return <ProjectForm mode="edit" projectId={id} />
}

export default EditProjectPage
