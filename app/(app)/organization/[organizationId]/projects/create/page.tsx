// app/(app)/organization/[organizationId]/projects/create/page.tsx
import CreateProjectForm from '@src/modules/pm/projects/components/CreateProjectForm'
import { Suspense } from 'react'

const CreateProjectPage = () => {
  return (
    <Suspense>
      <CreateProjectForm />
    </Suspense>
  )
}

export default CreateProjectPage
