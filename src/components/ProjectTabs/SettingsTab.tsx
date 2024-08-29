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

interface SettingsTabProps {
  project: Project & { users: (ProjectUser & { user: User })[] }
}

const SettingsTab: FC<SettingsTabProps> = ({ project }) => {
  // Fetching data
  const { data: _users, isLoading: _usersLoading } = useSWR<User[]>(
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
      <div className="flex justify-between mb-5">
        <div>
          <span className="font-bold" style={{ fontSize: 25 }}>
            Project managers
          </span>
          <div className="grid grid-cols-3 md:grid-cols-5">
            {project?.users?.map((u) =>
              u.isManager ? (
                <div className="flex items-center gap-2 p-2">
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
        </div>
        {(isTeamAdminOrOwner(session) || isSessionProjectManager) && (
          <div className="flex items-center max-h-[40px] border hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              Add manager
            </Button>
          </div>
        )}
      </div>

      <Separator className="mb-4" />

      <div className="flex justify-between mb-5">
        <div>
          <span className="font-bold" style={{ fontSize: 18 }}>
            Assigned to project
          </span>
          <div className="p-4">
            <AvatarGroup
              usernames={project?.users?.map((u) => u.user.name ?? '') ?? []}
              avatarSize={9}
              previewAmount={4}
              fontSize={12}
            />
          </div>
        </div>
        {isTeamAdminOrOwner(session) && (
          <div className="flex max-h-[40px] items-center border hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              Assign Users
            </Button>
          </div>
        )}
      </div>

      {isTeamAdminOrOwner(session) ? (
        <div className="flex justify-end gap-2">
          <Button
            onClick={() =>
              updateResourceById('projekt', project.id, {
                archived: !project.archived,
              })
            }
            className="gap-2"
          >
            <Archive className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer " />
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
            <Button className="gap-2">
              <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
              <span>Delete</span>
            </Button>
          </ConfirmationDialog>
        </div>
      ) : (
        <div className="w-full h-[50px]" />
      )}

      <AddTaskCategoryDialog
        mutate={updateCategories}
        projectId={project?.id}
        key={'task-category-dialog'}
      >
        <div className="flex items-center max-h-[40px] border hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
          <Button
            style={{ fontSize: 11, textDecoration: 'none' }}
            variant="link"
          >
            Add Task Category
          </Button>
        </div>
      </AddTaskCategoryDialog>
      {taskCategories?.map((category) => (
        <TaskCategoryItem
          iconName={'map-pin'}
          key={`category-item-${category.title}`}
          title={category.title}
        />
      ))}
    </>
  )
}

export default SettingsTab
