import React, { useEffect, useState } from 'react'
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
import type { Project, User } from '@prisma/client'
import { fetcher } from '@/src/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@src/components/ui/select'
import UserAvatar from '@src/components/UserAvatar'

const TaskDialog = () => {
  // Fetching Data
  const { data: projects } = useSWR<Project[]>('/api/db/projekt', fetcher)
  const { data: users } = useSWR<User[]>('/api/db/user', fetcher)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Project</Label>
            <Select required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects?.map((project) => (
                    <SelectItem value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Task Name</Label>
            <Input id="task-name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Input id="description" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Assign To</Label>
            <Select required>
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
          <Button
            type="button"
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-500"
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDialog
