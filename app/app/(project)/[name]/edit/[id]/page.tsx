'use client'
import { Button } from '@src/components/ui/button'
import type { Task, User } from '@prisma/client'
import { Undo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

const EditTaskPage = ({ params }: { params: { id: string } }) => {
  const { data: task } = useSWR<
    Task & {
      assignedTo: User
    }
  >(`/api/db/task/${params.id}`)

  const router = useRouter()

  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-5 dark:text-white">
        <span style={{ fontSize: 20 }}>Edit Task</span>
        <div>|</div>
        <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
          <Undo width={15} className="ml-2" />
          <Button
            style={{ textDecoration: 'none' }}
            variant={'link'}
            onClick={() => router.back()}
          >
            Return to Tasks
          </Button>
        </div>
      </div>
      <div className="mt-8 mb-2">{task?.title} </div>
    </main>
  )
}

export default EditTaskPage
