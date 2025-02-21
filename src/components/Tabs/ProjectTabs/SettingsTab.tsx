'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import { updateResourceById } from '@src/lib/api/updateResource'
import { deleteResources } from '@src/lib/api/deleteResource'
import {
  PriorityType,
  StatusType,
  type Project,
  type ProjectUser,
  type User,
} from '@prisma/client'

import { Button } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { ScrollArea } from '@src/components/ui/scroll-area'
import { Separator } from '@src/components/ui/separator'
import {
  Archive,
  Trash2,
  Settings,
  Users,
  ChevronRight,
  MoreVertical,
} from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@ui/radio-group'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import UserMultiSelect from '@src/components/Select/UserMultiSelect'
import UserAvatar from '@src/components/Avatar/UserAvatar'

interface TabContentProps {
  [key: string]: JSX.Element
}

const SettingsTab = () => {
  const projectContext = useContext(ProjectDataContext)
  const router = useRouter()
  const { data: session } = useSession({ required: true })

  const { data: project, mutate: mutateProject } = useSWR<Project>({
    url: projectContext ? `project/${projectContext.projectId}` : '',
    select: {
      name: true,
      status: true,
      priority: true,
      archived: true,
    },
  })

  const { data: projectUsers, mutate: updateProjectUsers } = useSWR<
    (ProjectUser & { user: User })[]
  >(
    projectContext
      ? `projectuser?projectId=${projectContext.projectId}`
      : undefined,
  )

  const [activeTab, setActiveTab] = useState('general')
  const [editMode, setEditMode] = useState(false)
  const [editedProject, setEditedProject] = useState<
    Partial<Project> | undefined
  >(undefined)

  useEffect(() => {
    if (!editedProject && project) {
      setEditedProject({
        archived: project?.archived,
        priority: project?.priority,
        status: project?.status,
        name: project?.name,
      })
    }
  }, [project, editedProject])

  const canEdit = useMemo(() => {
    const isSessionProjectManager = projectUsers?.some(
      (user) => user.userId === session?.user.id && user.isManager,
    )
    return isTeamAdminOrOwner(session) || isSessionProjectManager
  }, [session, projectUsers])

  const [assignedUserIds, setAssignedUserIds] = useState<string[] | null>(null)
  const [managerIds, setManagersIds] = useState<string[] | null>(null)

  useEffect(() => {
    if (projectUsers) {
      const userIds = projectUsers.map((pu) => pu.userId)
      setAssignedUserIds(userIds)
    }
  }, [projectUsers])

  useEffect(() => {
    if (projectUsers) {
      const managerIds = projectUsers
        .filter((pu) => pu.isManager)
        .map((pu) => pu.userId)
      setManagersIds(managerIds)
    }
  }, [projectUsers])

  const handleSave = () => {
    updateResourceById('project', project?.id ?? '', editedProject, {
      mutate: mutateProject as any,
    })
    setEditMode(false)
  }

  const handleArchive = () => {
    updateResourceById(
      'project',
      project?.id ?? '',
      {
        archived: !project?.archived,
      },
      {
        mutate: mutateProject as any,
      },
    )
  }

  const onManagerSelectionUpdate = (ids: string[]) => {
    updateResourceById(
      'projectuser',
      projectContext?.projectId ?? '',
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
      projectContext?.projectId ?? '',
      {
        userIds: ids,
      },
      { mutate: updateProjectUsers },
    )
  }

  const tabContent: TabContentProps = {
    general: (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={editMode ? editedProject?.name : project?.name}
            onChange={(e) => {
              if (editedProject) {
                setEditedProject({ ...editedProject, name: e.target.value })
              }
            }}
            disabled={!editMode}
          />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <RadioGroup
            disabled={!editMode}
            value={editMode ? editedProject?.priority : project?.priority}
            onValueChange={(value) => {
              if (editedProject) {
                setEditedProject({
                  ...editedProject,
                  priority: value as PriorityType,
                })
              }
            }}
          >
            {Object.keys(PriorityType).map((type) => (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label>{capitalize(type)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>

          <RadioGroup
            disabled={!editMode}
            value={editMode ? editedProject?.status : project?.status}
            onValueChange={(value) => {
              if (editedProject) {
                setEditedProject({
                  ...editedProject,
                  status: value as StatusType,
                })
              }
            }}
          >
            {Object.keys(StatusType).map((type) => (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label>{(capitalize(type) as string).replace('_', ' ')}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    ),
    users: (
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {projectUsers?.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <UserAvatar
                  avatarSize={40}
                  username={user.user.name}
                  fontSize={15}
                />
                <div>
                  <p className="font-medium">{user.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.user.email}
                  </p>
                </div>
              </div>
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
  }

  return (
    <div className="px-[5%] ">
      <div className="flex justify-between items-center mb-8">
        <div />
        {canEdit && (
          <div className="flex">
            <div className="flex gap-1">
              <>
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
              </>
              <>
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
              </>
              <Button onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-8">
        <div className="w-64">
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'general' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('general')}
            >
              <Settings className="mr-2 h-4 w-4" />
              General
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </nav>
          {canEdit && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-yellow-600"
                  onClick={handleArchive}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  {project?.archived ? 'Unarchive' : 'Archive'}
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
                    variant="outline"
                    className="w-full justify-start text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </ConfirmationDialog>
              </div>
            </>
          )}
        </div>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {editMode && (
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}

export default SettingsTab
