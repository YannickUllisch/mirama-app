'use client'
import type { Task } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { useMemo, type FC } from 'react'

interface PersonalTabProps {
  tasks: Task[]
}

const PersonalTab: FC<PersonalTabProps> = ({ tasks }) => {
  const { data: session } = useSession()

  const _filteredTasks = useMemo(() => {
    tasks.filter((task) => task.assignedToId === session?.user.id)
  }, [tasks, session])
  return <div>PersonalTab</div>
}

export default PersonalTab
