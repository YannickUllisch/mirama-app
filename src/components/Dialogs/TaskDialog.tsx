import type React from 'react'
import { type FC, useState } from 'react'
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
import type { Task, User } from '@prisma/client'
import { api, cn } from '@/src/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@src/components/ui/select'
import UserAvatar from '@/src/components/Header/UserAvatar'
import { toast } from 'sonner'
import { v4 } from 'uuid'
import { useSession } from 'next-auth/react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'

interface TaskDialogProps {
  mutate?(): any
  button: React.ReactNode
  projectId: string
}

const TaskDialog: FC<TaskDialogProps> = (props) => {
  const { data: session } = useSession()
  const [datePopupOpen, setDatePopupOpen] = useState(false)
  // States
  const [task, setTask] = useState<Task>({
    id: v4(),
    assignedToId: null,
    title: '',
    dueDate: new Date(),
    teamId: session?.user.teamId,
    description: null,
    status: 'TODO',
    priority: 'LOW',
    projectId: props.projectId,
    dateCreated: new Date(),
    dateFinished: new Date(),
  } as Task)

  // Fetching Data
  const { data: users } = useSWR<User[]>('/api/db/user')

  const createtask = () => {
    try {
      toast.promise(api.post('task', task), {
        loading: 'Adding Task..',
        error: (err) => err.statusText ?? err,
        success: () => {
          if (props.mutate) {
            props.mutate()
          }

          return 'Tasks Added!'
        },
      })
      handleClose()
    } catch (error: any) {
      toast.error(error)
    }
  }

  const handleClose = () => {
    setTask({
      id: v4(),
      assignedToId: null,
      title: '',
      dueDate: new Date(),
      teamId: session?.user.teamId,
      description: null,
      status: 'TODO',
      priority: 'LOW',
      projectId: props.projectId,
      dateCreated: new Date(),
      dateFinished: new Date(),
    } as Task)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.button}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Title</Label>
            <Input
              id="title"
              className="col-span-3"
              onChangeCapture={(e) =>
                setTask({ ...task, title: e.currentTarget.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input
              id="end-date"
              className="col-span-3"
              onChangeCapture={(e) =>
                setTask({ ...task, description: e.currentTarget.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Due Date</Label>
            <Popover
              open={datePopupOpen}
              onOpenChange={() => setDatePopupOpen((curr) => !curr)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !task.dueDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.dueDate ? format(task.dueDate, 'PPP') : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  onDayFocus={() => setDatePopupOpen(false)}
                  mode="single"
                  selected={task.dueDate ?? undefined}
                  onSelect={(e) => setTask({ ...task, dueDate: e as Date })}
                  initialFocus
                  className="dark:focus:bg-red-500 rounded-md border shadow dark:bg-neutral-900 dark:border-neutral-800"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Assign To</Label>
            <Select
              required
              onValueChange={(val) => setTask({ ...task, assignedToId: val })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users?.map((user) => (
                    <SelectItem value={user.id} key={user.id}>
                      <div className="flex items-center gap-1">
                        <UserAvatar
                          avatarSize={6}
                          fontSize={10}
                          username={user.name}
                        />
                        {user.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
              onClick={createtask}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              Add Task
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDialog
