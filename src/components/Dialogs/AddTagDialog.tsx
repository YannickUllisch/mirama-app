'use client'
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
import type { Tag } from '@prisma/client'
import { postResource } from '@src/lib/api/postResource'

interface AddProjectDialogProps {
  mutate?(): any
  button: React.ReactNode
}

const AddTagDialog: FC<AddProjectDialogProps> = (props) => {
  // States
  const [tag, setTag] = useState<Tag>({
    id: '',
    teamId: '',
    title: '',
  } as Tag)

  const createProject = () => {
    postResource('tag', tag, { mutate: props.mutate }).then(() => {
      handleClose()
    })
  }

  const handleClose = () => {
    setTag({
      id: '',
      teamId: '',
      title: '',
    } as Tag)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.button}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
          <DialogDescription>
            Tags can be applied to both Projects and Tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label>Title</Label>
            <Input
              id="title"
              className="col-span-3"
              onChangeCapture={(e) =>
                setTag({ ...tag, title: e.currentTarget.value })
              }
            />
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

export default AddTagDialog
