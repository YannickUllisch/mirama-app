'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState, type FC } from 'react'
import { Button } from '@src/components/ui/button'
import type { Project, ProjectUser, TaskCategory, User } from '@prisma/client'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { useSession } from 'next-auth/react'
import { Archive, Trash2 } from 'lucide-react'
import { updateResourceById } from '@src/lib/api/updateResource'
import { deleteResources } from '@src/lib/api/deleteResource'
import useSWR from 'swr'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import { Separator } from '@src/components/ui/separator'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import UserMultiSelect from '@src/components/Select/UserMultiSelect'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import AddTaskCategoryDialog from '@src/components/Dialogs/AddTaskCategoryDialog'
import TaskCategoryItem from '@src/components/Tasket/TaskCategoryItem'

interface SettingsTabProps {
  projectId: string
}

const SettingsTab: FC<SettingsTabProps> = ({ projectId }) => {
  // States

  // Fetching Data
  const { data: project } = useSWR<Project>(`/api/db/project/${projectId}`)

  const { data: taskCategories, mutate: updateCategories } = useSWR<
    TaskCategory[]
  >(`/api/db/project/taskCategories?projectId=${projectId}`)

  const { data: projectUsers, mutate: updateProjectUsers } = useSWR<
    (ProjectUser & { user: User })[]
  >(`/api/db/projectuser?projectId=${projectId}`)

  const [managerIds, setManagersIds] = useState<string[]>(
    projectUsers?.filter((user) => user.isManager).map((pu) => pu.userId) ?? [],
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined)

  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)

  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(
    projectUsers?.map((pu) => pu.userId) ?? [],
  )

  const onManagerSelectionUpdate = (ids: string[]) => {
    updateResourceById(
      'projectuser',
      projectId,
      {
        userIds: ids,
        setAsManagers: true,
      },
      { mutate: updateProjectUsers },
    )
  }

  const onAssignedUserSelectionUpdate = (ids: string[]) => {
    updateResourceById(
      'projectuser',
      projectId,
      {
        userIds: ids,
      },
      { mutate: updateProjectUsers },
    )
  }

  const selectedTaskCategory = useMemo(() => {
    if (selectedCategoryId && taskCategories) {
      return taskCategories.find((cat) => cat.id === selectedCategoryId)
    }
    return undefined
  }, [selectedCategoryId, taskCategories])

  const router = useRouter()
  const { data: session } = useSession({ required: true })

  const isSessionProjectManager = useMemo(() => {
    return projectUsers?.find((user) => user.id === session?.user.id)?.isManager
  }, [projectUsers, session])

  return (
    <div className="flex justify-between mb-5 flex-col">
      <div className="flex justify-between pb-10">
        <div className="flex flex-col">
          <span className="font-medium text-3xl">General</span>
          <span>{project?.name}</span>
          <span>{project?.priority}</span>
          <span>{project?.status}</span>
        </div>

        {isTeamAdminOrOwner(session) || isSessionProjectManager ? (
          <div className="flex justify-start gap-2">
            <Button
              onClick={() =>
                updateResourceById('project', project?.id ?? '', {
                  archived: !project?.archived,
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
                deleteResources('project', [project?.id ?? '']).then(() =>
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
          {projectUsers?.map((u) =>
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
              selectedUserIds={managerIds}
              setSelectedUserIds={setManagersIds}
              onSelectionChange={onManagerSelectionUpdate}
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
            usernames={projectUsers?.map((u) => u.user.name ?? '') ?? []}
            avatarSize={9}
            previewAmount={4}
            fontSize={12}
          />
        </div>
        {isTeamAdminOrOwner(session) && (
          <div className="flex items-center">
            <UserMultiSelect
              selectedUserIds={assignedUserIds}
              setSelectedUserIds={setAssignedUserIds}
              onSelectionChange={onAssignedUserSelectionUpdate}
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
            projectId={projectId}
            key={'task-category-dialog'}
            open={categoryDialogOpen}
            setOpen={setCategoryDialogOpen}
            defaultCategory={selectedTaskCategory}
            onClose={() => setSelectedCategoryId(undefined)}
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
              color={category.color}
              key={`category-item-${category.title}`}
              title={category.title}
              onClick={() => {
                setSelectedCategoryId(category.id)
                setCategoryDialogOpen(true)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
