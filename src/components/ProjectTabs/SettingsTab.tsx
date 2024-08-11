'use client'
import { api } from '@api'
import { useRouter } from 'next/navigation'
import React, { type FC } from 'react'
import { toast } from 'sonner'
import { Button } from '@src/components/ui/button'
import { Checkbox } from '@src/components/ui/checkbox'
import type { Project, ProjectUser, User } from '@prisma/client'
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'

interface SettingsTabProps {
  project: Project & { users: (ProjectUser & { user: User })[] }
}

const SettingsTab: FC<SettingsTabProps> = ({ project }) => {
  const router = useRouter()

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
    <div>
      <ConfirmationDialog
        dialogTitle={'Are you sure?'}
        dialogDesc={'Deleting a project can not be undone!'}
        submitButtonText={'Delete'}
        dialogTrigger={<Button variant={'destructive'}>Delete</Button>}
        onConfirmation={deleteProject}
      />
      <div className="flex items-center justify-center gap-1">
        <Checkbox />
        Archive
      </div>
    </div>
  )
}

export default SettingsTab
