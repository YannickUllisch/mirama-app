'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { InvitationSchema } from '@src/lib/schemas'
import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useTransition,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Input } from '@src/components/ui/input'
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
import { postResource } from '@src/lib/api/postResource'
import type { KeyedMutator } from 'swr'
import { Role, type TaskCategory, type User } from '@prisma/client'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { TaskCategorySchema } from '@/prisma/zod'
import { v4 } from 'uuid'
import { Book, MapPin } from 'lucide-react'

interface AddTaskCategoryProps {
  mutate: KeyedMutator<TaskCategory[]>
  projectId: string
}

const AddTaskCategoryDialog: FC<PropsWithChildren<AddTaskCategoryProps>> = ({
  children,
  mutate,
  projectId,
}) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof TaskCategorySchema>>({
    resolver: zodResolver(TaskCategorySchema),
    defaultValues: {
      icon: '',
      projectId: projectId,
      title: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof TaskCategorySchema>) => {
    startTransition(() => {
      postResource('projekt/taskCategories', vals, { mutate })
        .then(() => {
          form.reset()
          setIsOpen(false)
        })
        .catch(() => {
          setIsOpen(false)
        })
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
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
                    <FormLabel>Category</FormLabel>
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Icon</FormLabel>
                      <Select
                        disabled={isPending}
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MapPin">
                            <MapPin />
                          </SelectItem>
                          <SelectItem value="Book">
                            <Book />
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
