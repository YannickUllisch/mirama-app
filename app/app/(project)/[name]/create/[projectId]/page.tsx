'use client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import GeneralSelect from '@src/components/Select/GeneralSelect'
import { Button } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import { Separator } from '@src/components/ui/separator'
import { Textarea } from '@src/components/ui/textarea'
import { TaskSchema } from '@src/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { PriorityType, Role, TaskStatusType, type User } from '@prisma/client'
import { BookCheck, Save, Undo, User as UserIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'
import type { z } from 'zod'
import { postResource } from '@src/lib/api/postResource'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'

const CreateTaskPage = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // TODO: Replace this with only Users added to the project later
  const { data: users } = useSWR<User[]>('/api/db/team/member')

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      assignedToId: null,
      description: '',
      title: '',
      dueDate: new Date(),
      priority: 'LOW',
      projectId: projectId as string,
      status: 'DOING',
    },
  })

  const onSubmit = (vals: z.infer<typeof TaskSchema>) => {
    startTransition(() => {
      postResource('task', vals).then(() => {
        router.back()
      })
    })
  }

  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-4 dark:text-white">
        <BookCheck width={20} />
        <span style={{ fontSize: 20 }}>Create Task</span>
        <div>|</div>
        <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
          <Undo width={10} className="ml-2" />
          <Button
            style={{ textDecoration: 'none', fontSize: 12 }}
            variant={'link'}
            onClick={() => router.back()}
          >
            Return to Overview
          </Button>
        </div>
      </div>
      <Separator className="mt-2" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="form-group">
            <div className="flex gap-3 items-center">
              <h4 style={{ fontSize: 15 }}>New Task</h4>
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter Title"
                      type="text"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={Role.USER}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role for Member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PriorityType.LOW}>
                        {PriorityType.LOW}
                      </SelectItem>
                      <SelectItem value={PriorityType.MEDIUM}>
                        {PriorityType.MEDIUM}
                      </SelectItem>
                      <SelectItem value={PriorityType.HIGH}>
                        {PriorityType.HIGH}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-2">
              <GeneralSelect
                stylingProps={{
                  triggerStyle: 'border dark:border-neutral-800 w-[15%]',
                }}
                id={''}
                initialValue={
                  <div className="flex items-center gap-3 text-sm">
                    <UserIcon width={15} />
                    No one selected
                  </div>
                }
              >
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
              </GeneralSelect>
              <div
                className="flex items-center text-white hover:bg-blue-500 dark:hover:bg-blue-700 rounded-sm cursor-pointer bg-blue-600"
                aria-label="Save Task Button"
              >
                <Save width={15} className="ml-2" />
                <Button
                  type="submit"
                  // disabled={watch().title.length < 1}
                  style={{
                    fontSize: 11,
                    textDecoration: 'none',
                    color: 'white',
                  }}
                  variant="link"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-between m-2">
            <Textarea
              className="w-[25%] px-10"
              {...form.register('description')}
              placeholder="Add task description here."
            />
            <GeneralSelect
              id={''}
              initialValue={TaskStatusType.TODO}
              stylingProps={{
                triggerStyle: 'border dark:border-neutral-800 w-[15%]',
              }}
            >
              <SelectItem value={TaskStatusType.TODO}>To Do</SelectItem>
              <SelectItem value={TaskStatusType.DOING}>Doing</SelectItem>
              <SelectItem value={TaskStatusType.INREVIEW}>In Review</SelectItem>
              <SelectItem value={TaskStatusType.DONE}>Done</SelectItem>
            </GeneralSelect>
            <GeneralSelect
              id={''}
              initialValue={PriorityType.LOW}
              stylingProps={{
                triggerStyle: 'border dark:border-neutral-800 w-[15%]',
              }}
            >
              <SelectItem value={PriorityType.LOW}>Low</SelectItem>
              <SelectItem value={PriorityType.MEDIUM}>Medium</SelectItem>
              <SelectItem value={PriorityType.HIGH}>High</SelectItem>
            </GeneralSelect>
          </div>
        </form>
      </FormProvider>
    </main>
  )
}

export default CreateTaskPage
