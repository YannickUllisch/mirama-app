import type React from 'react'
import { useEffect, useRef } from 'react'
import type { BarTask } from '../../types/bar-task'
import type { Task } from '../../types/public-types'

export type TaskListProps = {
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  rowHeight: number
  scrollY: number
  locale: string
  tasks: Task[]
  taskListRef: React.RefObject<HTMLDivElement>
  selectedTask: BarTask | undefined
  setSelectedTask: (task: string) => void
  onExpanderClick: (task: Task) => void
  TaskListHeader: React.FC<{
    headerHeight: number
    rowWidth: string
    fontFamily: string
    fontSize: string
  }>
  TaskListTable: React.FC<{
    rowHeight: number
    rowWidth: string
    fontFamily: string
    fontSize: string
    locale: string
    tasks: Task[]
    selectedTaskId: string
    setSelectedTask: (taskId: string) => void
    onExpanderClick: (task: Task) => void
  }>
}

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  TaskListHeader,
  TaskListTable,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY
    }
  }, [scrollY])

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  }
  const selectedTaskId = selectedTask ? selectedTask.id : ''
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
  }

  return (
    <div
      className="z-10 stroke-yellow-500 border-r-2 overflow-x-scroll w-full"
      style={{ boxShadow: '10px 0px 10px 0px rgba(0, 0, 0, 0.05)' }}
    >
      <TaskListHeader {...headerProps} />
      <TaskListTable {...tableProps} />
    </div>
  )
}
