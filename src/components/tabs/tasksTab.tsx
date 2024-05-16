'use client'
import type { FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import { fetcher } from '@/src/lib/utils'

interface TabProps {
  projectId: string
}

const Overview: FC<TabProps> = ({ projectId }) => {
  const { data: _tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)

  return <div>aa</div>
}
export default Overview
