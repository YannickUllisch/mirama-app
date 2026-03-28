'use client'
import { type Task, TaskStatusType } from '@prisma/client'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'

const SkeletonLoader = () => {
  return (
    <ul className="space-y-4 mb-8 w-full">
      {[...Array(5)].map((i, index) => (
        <li key={i} className="py-3">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-600 rounded-full flex-shrink-0 animate-pulse" />
            <div className="flex-grow flex items-center justify-between">
              <div
                className={`h-4 bg-gray-600 rounded-md animate-pulse w-${
                  ['3/4', '2/3', '5/6', '1/2', '4/5'][index]
                }`}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

interface CheckboxTaskListProps {
  tasks: Task[] | undefined
}

const CheckboxTaskList: FC<CheckboxTaskListProps> = ({
  tasks: initialTasks,
}) => {
  const [tasks, setTasks] = useState<Task[] | undefined>(initialTasks)
  const [error, setError] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  useEffect(() => {
    setTasks(initialTasks) // Sync state if tasks change externally
  }, [initialTasks])

  const toggleTaskCompletion = async (taskId: string) => {
    if (!tasks) return
    const originalTasks = tasks
    const updatedTasks = tasks
      .map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === TaskStatusType.DONE
                  ? TaskStatusType.NEW
                  : TaskStatusType.DONE,
            }
          : task,
      )
      .sort((a, b) =>
        a.status === 'DONE' && b.status === 'DONE' && a.status === b.status
          ? 0
          : a.status === 'DONE'
            ? 1
            : -1,
      )

    // Optimistically update the UI
    setTasks(updatedTasks)
    setUpdatingTaskId(taskId)

    try {
      await updateResourceByIdNoToast('task', taskId, {
        status: updatedTasks.find((task) => task.id === taskId)?.status,
      })
    } catch (error) {
      console.error('Failed to update task status:', error)
      setError('Failed to update task status. Please try again.')
      setTasks(originalTasks) // Rollback on failure
    } finally {
      setUpdatingTaskId(null)
    }
  }

  return (
    <div className="text-white p-4 flex flex-col relative">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          {!tasks ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <motion.ul layout className="space-y-4 mb-8 w-full">
              <AnimatePresence initial={false}>
                {tasks?.map((task) => (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      duration: 0.3,
                    }}
                    className={`py-3 cursor-pointer group ${
                      task.status === TaskStatusType.DONE ? 'opacity-60' : ''
                    }`}
                    onClick={() => {
                      setUpdatingTaskId(task.id)
                      setTimeout(() => {
                        toggleTaskCompletion(task.id)
                      }, 10)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-5 h-5 flex-shrink-0 relative"
                        animate={
                          updatingTaskId === task.id
                            ? { rotate: 360 }
                            : { rotate: 0 }
                        }
                        transition={
                          updatingTaskId === task.id
                            ? {
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                              }
                            : { duration: 0 }
                        }
                      >
                        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke={
                              task.status === TaskStatusType.DONE
                                ? '#f43f5e'
                                : '#4b5563'
                            }
                            strokeWidth="2"
                            fill={
                              task.status === TaskStatusType.DONE
                                ? '#f43f5e'
                                : 'none'
                            }
                            className={
                              updatingTaskId === task.id
                                ? 'opacity-30'
                                : task.status === TaskStatusType.DONE
                                  ? ''
                                  : 'group-hover:stroke-white'
                            }
                          />
                          {updatingTaskId === task.id && (
                            <path
                              d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12"
                              stroke={
                                task.status === TaskStatusType.DONE
                                  ? '#f43f5e'
                                  : 'white'
                              }
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          )}
                          {task.status === TaskStatusType.DONE &&
                            updatingTaskId !== task.id && (
                              <path
                                d="M8 12L11 15L16 9"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            )}
                        </svg>
                      </motion.div>
                      <div className="flex-grow flex items-center justify-between overflow-hidden">
                        <span className="text-sm truncate text-gray-400 group-hover:text-white transition-colors duration-300 ease-in-out">
                          {task.title}
                        </span>
                        {
                          <span className="text-xs ml-2 flex-shrink-0 text-gray-500 group-hover:text-white transition-colors duration-300 ease-in-out">
                            {'Team Name'}
                          </span>
                        }
                      </div>
                      {/** biome-ignore lint/a11y/noStaticElementInteractions: <tmp> */}
                      <div
                        className="hidden group-hover:block transition-opacity duration-200 ml-2"
                        onKeyDown={() => {}}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-300 ease-in-out" />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckboxTaskList
