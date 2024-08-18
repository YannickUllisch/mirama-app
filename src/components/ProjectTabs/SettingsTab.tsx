'use client'
import { api } from '@api'
import { useRouter } from 'next/navigation'
import React, { type FC } from 'react'
import { toast } from 'sonner'
import { Button } from '@src/components/ui/button'
import type { Project, ProjectUser, User } from '@prisma/client'
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'
import AvatarGroup from '../Avatar/AvatarGroup'
import UserAvatar from '../Avatar/UserAvatar'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { useSession } from 'next-auth/react'
import { Plus } from 'lucide-react'

interface SettingsTabProps {
  project: Project & { users: (ProjectUser & { user: User })[] }
}

const SettingsTab: FC<SettingsTabProps> = ({ project }) => {
  const router = useRouter()
  const { data: session } = useSession()

  const deleteProject = () => {
    try {
      toast.promise(api.delete(`projekt?id=${project.id}`), {
        loading: 'Deleting Project..',
        success: () => {
          router.push('/overview')
          return 'Project Successfully Deleted!'
        },
        error: (err) => err.message ?? err,
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  const _archiveProject = () => {
    try {
      toast.promise(
        api.put(`projekt?id=${project.id}`, { archived: !project.archived }),
        {
          loading: 'Upadating Project..',
          error: (err) => err.response.statusText ?? err,
          success: () => {
            return 'Project Archived!'
          },
        },
      )
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <>
      <div>
        <ConfirmationDialog
          dialogTitle={'Are you sure?'}
          dialogDesc={'Deleting a project can not be undone!'}
          submitButtonText={'Delete'}
          dialogTrigger={<Button variant={'destructive'}>Delete</Button>}
          onConfirmation={deleteProject}
        />
      </div>
      <div className="w-full h-full">
        Assigned to project
        <AvatarGroup
          usernames={project.users.map((u) => u.user.name ?? '') ?? []}
          avatarSize={8}
          previewAmount={4}
          fontSize={10}
        />
      </div>
      <div>
        <span className="font-bold" style={{ fontSize: 25 }}>
          Project managers
        </span>

        {project.users?.map((u) =>
          u.isManager ? (
            <div className="flex items-center gap-2">
              <UserAvatar avatarSize={8} username={u.user.name} fontSize={10} />
              <div className="flex flex-col">
                <span className="text-sm">{u.user.name}</span>
                <span className="text-xs">{u.user.email}</span>
              </div>
            </div>
          ) : null,
        )}
        {isTeamAdminOrOwner(session) && (
          <div className="flex items-center w-[15%] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              Add manager
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default SettingsTab
