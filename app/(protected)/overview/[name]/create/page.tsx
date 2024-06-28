'use client'
import { Button } from '@/src/components/ui/button'
import { Undo } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React from 'react'

const CreateTaskPage = () => {
  const router = useRouter()
  const _params = useParams()
  //const { projectId } = params

  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-5 dark:text-white">
        <span style={{ fontSize: 20 }}>Create Task</span>
        <div>|</div>
        <div className="flex items-center hover:bg-neutral-100 p-1 ">
          <Undo width={15} />{' '}
          <Button
            style={{ textDecoration: 'none' }}
            variant={'link'}
            onClick={() => router.back()}
          >
            Return to Tasks
          </Button>
        </div>
      </div>
      <div className="mt-8 mb-2">test </div>
    </main>
  )
}

export default CreateTaskPage
