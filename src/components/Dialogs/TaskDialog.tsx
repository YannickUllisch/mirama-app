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
import { Button, type ButtonProps } from '@src/components/ui/button'
import { Label } from '@src/components/ui/label'
import { Input } from '@src/components/ui/input'
import useSWR from 'swr'
import type { Project, Task, User } from '@prisma/client'
import { api, fetcher } from '@/src/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@src/components/ui/select'
import UserAvatar from '@src/components/UserAvatar'
import { toast } from 'sonner'

interface TaskDialogProps {
  mutate?(): any
  button: React.ReactNode
  projectId: string
}

const TaskDialog: FC<TaskDialogProps> = (props) => {
  // States
  const [task, setTask] = useState<Task>({
    assignedToId: null,
    description: null,
    projectId: props.projectId,
    taskName: null,
  } as Task)

  // Fetching Data
  const { data: users } = useSWR<User[]>('/api/db/user', fetcher)

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
      assignedToId: null,
      description: null,
      projectId: props.projectId,
      taskName: null,
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
            <Label className="text-right">Task Name</Label>
            <Input
              id="task-name"
              className="col-span-3"
              onChangeCapture={(e) =>
                setTask({ ...task, taskName: e.currentTarget.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input
              id="description"
              className="col-span-3"
              onChangeCapture={(e) =>
                setTask({ ...task, description: e.currentTarget.value })
              }
            />
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
                    <SelectItem value={user.id}>
                      <UserAvatar username={user.name} />
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
