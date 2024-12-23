'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import type React from 'react'
import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  useTransition,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Input } from '@src/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import { Button } from '@src/components/ui/button'
import { postResource } from '@src/lib/api/postResource'
import type { KeyedMutator } from 'swr'
import type { TaskCategory } from '@prisma/client'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { TaskCategorySchema } from '@src/lib/schemas'
import { Label } from '../ui/label'
import { ColorPicker } from '../ui/color-picker'
import { updateResourceById } from '@src/lib/api/updateResource'

interface AddTaskCategoryProps {
  mutate: KeyedMutator<TaskCategory[]>
  projectId: string
  defaultCategory?: TaskCategory
  open: boolean
  setOpen: Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
}

const AddTaskCategoryDialog: FC<PropsWithChildren<AddTaskCategoryProps>> = ({
  children,
  mutate,
  projectId,
  defaultCategory,
  open,
  setOpen,
  onClose,
}) => {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof TaskCategorySchema>>({
    resolver: zodResolver(TaskCategorySchema),
    values: {
      id: defaultCategory?.id ?? '',
      projectId: projectId,
      title: defaultCategory?.title ?? '',
      color: defaultCategory?.color ?? '#FFFFFF',
    },
  })

  const onSubmit = (vals: z.infer<typeof TaskCategorySchema>) => {
    startTransition(() => {
      if (vals.id === '') {
        postResource('project/taskCategories', vals, { mutate })
          .then(() => {
            onDialogClose()
          })
          .catch(() => {
            onDialogClose()
          })
      } else {
        updateResourceById('project/taskCategories', vals.id, vals, { mutate })
          .then(() => {
            onDialogClose()
          })
          .catch(() => {
            onDialogClose()
          })
      }
    })
  }

  const onDialogClose = () => {
    if (open) {
      setOpen(false)
      onClose()
      form.reset()
      return
    }
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Define new Task Category</DialogTitle>
          <DialogDescription>
            Task Categories added here will be specifik to the current project.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            className={'grid items-start gap-4'}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>Category</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Category Name"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label>Color</Label>
                    <ColorPicker {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isPending} type="submit">
              Save changes
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default AddTaskCategoryDialog
