'use client'
import { useRouter } from 'next/navigation'
import React, { useMemo, type FC } from 'react'
import { Button } from '@src/components/ui/button'
import type { Project, ProjectUser, TaskCategory, User } from '@prisma/client'
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'
import AvatarGroup from '../Avatar/AvatarGroup'
import UserAvatar from '../Avatar/UserAvatar'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { useSession } from 'next-auth/react'
import { Archive, Trash2 } from 'lucide-react'
import { updateResourceById } from '@src/lib/api/updateResource'
import { deleteResources } from '@src/lib/api/deleteResource'
import useSWR from 'swr'
import { Separator } from '../ui/separator'
import AddTaskCategoryDialog from '../Dialogs/AddTaskCategoryDialog'
import TaskCategoryItem from '../task/TaskCategoryItem'
import UserMultiSelect from '../Select/UserMultiSelect'

interface SettingsTabProps {
  project: Project & { users: (ProjectUser & { user: User })[] }
}

const SettingsTab: FC<SettingsTabProps> = ({ project }) => {
  // Fetching data
  const { data: users, isLoading: _usersLoading } = useSWR<User[]>(
    '/api/db/team/member',
  )

  const { data: taskCategories, mutate: updateCategories } = useSWR<
    TaskCategory[]
  >(project ? `/api/db/projekt/taskCategories?projectId=${project.id}` : '')

  const router = useRouter()
  const { data: session } = useSession()

  const isSessionProjectManager = useMemo(() => {
    return project?.users?.find((user) => user.id === session?.user.id)
      ?.isManager
  }, [project, session])

  return (
    <>
      <div className="flex justify-between mb-5 flex-col">
        <div className="flex justify-between pb-10">
          <div className="flex flex-col">
            <span className="font-medium text-3xl">General</span>
            <span>{project.name}</span>
            <span>{project.priority}</span>
            <span>{project.status}</span>
          </div>

          {isTeamAdminOrOwner(session) || isSessionProjectManager ? (
            <div className="flex justify-start gap-2">
              <Button
                onClick={() =>
                  updateResourceById('projekt', project.id, {
                    archived: !project.archived,
                  })
                }
                className="gap-2 hover:text-orange-500 hover:no-underline hover:bg-hover"
                variant={'link'}
              >
                <Archive className="w-3.5 h-3.5 cursor-pointer" />
                <span key={'archive-button'}>
                  {project?.archived ? 'Unarchive' : 'Archive'}
                </span>
              </Button>

              <ConfirmationDialog
                dialogTitle={'Are you sure?'}
                dialogDesc={'Deleting a project can not be undone!'}
                submitButtonText={'Delete'}
                onConfirmation={() =>
                  deleteResources('projekt', [project.id]).then(() =>
                    router.push('/app'),
                  )
                }
              >
                <Button
                  className="gap-2 hover:text-red-500 hover:no-underline hover:bg-hover"
                  variant={'link'}
                >
                  <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                  <span>Delete</span>
                </Button>
              </ConfirmationDialog>
            </div>
          ) : (
            <div className="w-full h-[50px]" />
          )}
        </div>
        <Separator className="mb-4" />

        <>
          <span className="text-xl">Project managers</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 pb-5">
            {project?.users?.map((u) =>
              u.isManager ? (
                <div
                  className="flex items-center gap-2 p-2"
                  key={`manager-${u.userId}`}
                >
                  <UserAvatar
                    avatarSize={40}
                    username={u.user.name}
                    fontSize={15}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{u.user.name}</span>
                    <span className="text-xs text-text-secondary">
                      {u.user.email}
                    </span>
                  </div>
                </div>
              ) : null,
            )}
          </div>
          {isTeamAdminOrOwner(session) && (
            <div className="flex items-center">
              <UserMultiSelect
                assignedUsers={project.users.filter((u) => u.isManager) ?? []}
                users={users ?? []}
                projectId={project.id}
              >
                <Button
                  variant="link"
                  className="hover:bg-hover hover:no-underline hover:outline"
                >
                  Assign Managers
                </Button>
              </UserMultiSelect>
            </div>
          )}
        </>

        <Separator className="mb-4 mt-4" />

        <>
          <span className="text-xl flex flex-col">Assigned to project</span>
          <div className="p-4">
            <AvatarGroup
              usernames={project?.users?.map((u) => u.user.name ?? '') ?? []}
              avatarSize={9}
              previewAmount={4}
              fontSize={12}
            />
          </div>
          {isTeamAdminOrOwner(session) && (
            <div className="flex items-center">
              <UserMultiSelect
                assignedUsers={project.users ?? []}
                users={users ?? []}
                projectId={project.id}
              >
                <Button
                  variant="link"
                  className="hover:bg-hover hover:no-underline hover:outline"
                >
                  Assign Users
                </Button>
              </UserMultiSelect>
            </div>
          )}
        </>

        <Separator className="mb-4 mt-4" />
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span className="text-xl">Task Categories</span>
            <AddTaskCategoryDialog
              mutate={updateCategories}
              projectId={project?.id}
              key={'task-category-dialog'}
            >
              <Button
                variant="link"
                className="hover:bg-hover hover:no-underline hover:outline outline-none"
              >
                Add Task Category
              </Button>
            </AddTaskCategoryDialog>
          </div>
          <div className="flex gap-2">
            {taskCategories?.map((category) => (
              <TaskCategoryItem
                key={`category-item-${category.title}`}
                title={category.title}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsTab
