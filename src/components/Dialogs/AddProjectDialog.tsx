'use client'
import type React from 'react'
import { type FC, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import { Button } from '@src/components/ui/button'
import { Label } from '@src/components/ui/label'
import { Input } from '@src/components/ui/input'
import useSWR from 'swr'
import {
  PriorityType,
  type Project,
  Task,
  type User,
  type ProjectUser,
} from '@prisma/client'
import { capitalize, cn } from '@src/lib/utils'
import { api } from '@api'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@src/components/ui/select'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import { toast } from 'sonner'
import { v4 } from 'uuid'
import { useSession } from 'next-auth/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@src/components/ui/calendar'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../ui/multiselect'
import { postResource } from '@src/lib/api/postResource'

interface AddProjectDialogProps {
  mutate?(): any
  button: React.ReactNode
}

const AddProjectDialog: FC<AddProjectDialogProps> = (props) => {
  const { data: session } = useSession()
  const [startDatePopup, setStartDatePopup] = useState(false)
  const [endDatePopup, setEndDatePopup] = useState(false)
  // States
  const [project, setProject] = useState<
    Project & {
      users: (ProjectUser & { user: User })[]
    }
  >({
    id: v4(),
    budget: 0,
    archived: false,
    endDate: new Date(),
    name: '',
    priority: 'LOW',
    status: 'ACTIVE',
    startDate: new Date(),
    teamId: session?.user.teamId,
    users: [],
  } as Project & { users: (ProjectUser & { user: User })[] })

  // Fetching Data
  const { data: users } = useSWR<User[]>('/api/db/team/member')

  const createProject = () => {
    postResource('projekt', project, { mutate: props.mutate }).then(() => {
      handleClose()
    })
  }

  const handleClose = () => {
    setProject({
      id: v4(),
      budget: 0,
      archived: false,
      endDate: new Date(),
      name: '',
      priority: 'LOW',
      status: 'ACTIVE',
      startDate: new Date(),
      teamId: session?.user.teamId,
      users: [],
    } as Project & { users: (ProjectUser & { user: User })[] })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.button}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Input required attributes to create new Project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              id="title"
              className="col-span-3"
              onChangeCapture={(e) =>
                setProject({ ...project, name: e.currentTarget.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <Popover
              open={startDatePopup}
              onOpenChange={() => setStartDatePopup((curr) => !curr)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'col-span-3 justify-start text-left font-normal',
                    !project.startDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {project.startDate ? format(project.startDate, 'PPP') : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  onDayFocus={() => setStartDatePopup(false)}
                  mode="single"
                  selected={project.startDate ?? undefined}
                  onSelect={(e) =>
                    setProject({ ...project, startDate: e as Date })
                  }
                  initialFocus
                  className="dark:focus:bg-red-500 rounded-md border shadow dark:bg-neutral-900 dark:border-neutral-800"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <Popover
              open={endDatePopup}
              onOpenChange={() => setEndDatePopup((curr) => !curr)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'col-span-3 justify-start text-left font-normal',
                    !project.endDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {project.endDate ? format(project.endDate, 'PPP') : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  onDayFocus={() => setEndDatePopup(false)}
                  mode="single"
                  selected={project.endDate ?? undefined}
                  onSelect={(e) =>
                    setProject({ ...project, endDate: e as Date })
                  }
                  initialFocus
                  className="dark:focus:bg-red-500 rounded-md border shadow dark:bg-neutral-900 dark:border-neutral-800"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Priority</Label>
            <Select
              required
              onValueChange={(val) =>
                setProject({ ...project, priority: val as PriorityType })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PriorityType).map((type) => (
                  <SelectItem key={`priority-item-${type}`} value={type}>
                    {capitalize(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Budget</Label>
            <Input
              id="budget"
              className="col-span-3"
              onChangeCapture={(e) =>
                setProject({
                  ...project,
                  budget: Number(e.currentTarget.value),
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label className="text-right">Managed By</Label>
            <MultiSelector
              className="col-span-3 flex-grow"
              values={project.users.map((p) => p.user.name)}
              onValuesChange={(usernames) =>
                setProject((prevProject) => ({
                  ...prevProject,
                  users: usernames
                    .map((name) => {
                      const existingUser = users?.find(
                        (user) => user.name === name,
                      )
                      if (!existingUser) return null

                      const existingProjectUser = prevProject.users.find(
                        (pu) => pu.user.name === name,
                      )

                      return (
                        existingProjectUser || {
                          id: v4(),
                          isManager: true, // Adjust as needed
                          projectId: prevProject.id,
                          userId: existingUser.id,
                          user: existingUser,
                        }
                      )
                    })
                    .filter((u) => u !== null) as (ProjectUser & {
                    user: User
                  })[],
                }))
              }
              loop
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder="Select Users" />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {users?.map((user) => (
                    <MultiSelectorItem
                      value={user.name}
                      className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
                      key={`multiselect-item-${user.name}`}
                    >
                      <div className="flex items-center gap-1 text-text">
                        <UserAvatar
                          avatarSize={6}
                          fontSize={10}
                          username={user.name}
                        />
                        {user.name}
                      </div>
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="link">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={createProject}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddProjectDialog
