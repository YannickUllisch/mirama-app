import {
  type Project,
  type Task,
  TaskStatusType,
} from '@/prisma/generated/client'
import { differenceInDays } from 'date-fns'

export const getDaysRemaining = (endDate: Date) => {
  const today = new Date()
  return differenceInDays(endDate, today)
}

export const calculateProjectProgress = (
  project: Project & { tasks: Task[] },
) => {
  if (!project.tasks || project.tasks.length === 0) return 0
  const completed = project.tasks.filter(
    (task) => task.status === TaskStatusType.DONE,
  ).length
  return Math.round((completed / project.tasks.length) * 100)
}

export const addProjectIdToLocalStorage = (
  setValue: React.Dispatch<React.SetStateAction<string[]>>,
  projectId: string,
) => {
  setValue((prev: string[]) => {
    if (prev.includes(projectId)) return prev
    const updatedProjects = Array.isArray(prev)
      ? [...prev, projectId]
      : [projectId]
    if (updatedProjects.length > 4) {
      updatedProjects.shift() // Remove the oldest project (FIFO)
    }
    return updatedProjects
  })
}
