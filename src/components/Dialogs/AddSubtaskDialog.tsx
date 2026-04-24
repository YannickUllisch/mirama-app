import type { Task } from '@/prisma/generated/client'

import { capitalize } from '@src/lib/utils'
import { type FC, type PropsWithChildren, useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface AddSubtaskdialogProps {
  parentId: string
  subTasks: Task[]
  mutate?: () => any
}

const AddSubtaskDialog: FC<PropsWithChildren<AddSubtaskdialogProps>> = ({
  parentId,
  children,
  subTasks,
  mutate,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')

  const LinkSubtask = () => {
    // updateResourceById(
    //   'task',
    //   selectedTaskId,
    //   { parentId: parentId },
    //   { mutate: mutate },
    // )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Link Subtask</DialogTitle>
          <DialogDescription>
            Link a task as a subtask. Doing this will overwrite the selected
            tasks current link to parent.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 py-4">
          <Select
            value={selectedTaskId}
            onValueChange={(val) => setSelectedTaskId(val)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select Task" />
            </SelectTrigger>
            <SelectContent key={'subtasks select'}>
              {subTasks.map((task) => (
                <SelectItem key={`task-item-${task.id}`} value={task.id}>
                  {capitalize(task.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="link">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="tertiary" onClick={LinkSubtask}>
              Link
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddSubtaskDialog
