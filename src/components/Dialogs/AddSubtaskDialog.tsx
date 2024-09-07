import type { Task } from '@prisma/client'
import React, { type PropsWithChildren, useState, type FC } from 'react'
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
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { capitalize } from '@src/lib/utils'
import { updateResourceById } from '@src/lib/api/updateResource'

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
    updateResourceById(
      'task',
      selectedTaskId,
      { parentId: parentId },
      { mutate: mutate },
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
            <Button
              type="button"
              variant="success"
              onClick={LinkSubtask}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Link
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddSubtaskDialog
