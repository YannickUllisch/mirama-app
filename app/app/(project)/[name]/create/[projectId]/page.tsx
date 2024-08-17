'use client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
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
import {
  PriorityType,
  type Project,
  type ProjectUser,
  TaskStatusType,
  type User,
} from '@prisma/client'
import {
  BookCheck,
  Delete,
  Save,
  Trash,
  Undo,
  User as UserIcon,
} from 'lucide-react'
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
import { Accordion } from '@src/components/ui/accordion'
import GeneralAccordion from '@src/components/GeneralAccordion'

const CreateTaskPage = ({ params }: { params: { projectId: string } }) => {
  const router = useRouter()

  // TODO: Replace this with only Users added to the project later
  const { data: project } = useSWR<
    Project & {
      users: (ProjectUser & { user: User })[]
    }
  >(`/api/db/projekt/single/${params.projectId}`)

  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      assignedToId: null,
      description: '',
      title: '',
      dueDate: new Date(),
      priority: 'LOW',
      projectId: params.projectId as string,
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
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between">
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

            <div className="flex items-center gap-3">
              <div
                className="flex items-center text-white hover:bg-blue-500 dark:hover:bg-blue-700 rounded-sm cursor-pointer bg-blue-600"
                aria-label="Save Task Button"
              >
                <Save width={15} className="ml-2" />
                <Button
                  type="submit"
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
          <Separator className="mt-2 mb-5" />

          <div className="form-group">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter Title"
                      type="text"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between mt-2">
              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Select onValueChange={field.onChange} value={undefined}>
                      <FormControl>
                        <SelectTrigger className="border dark:border-neutral-800 min-w-[15%]">
                          {field.value ? (
                            <SelectValue defaultValue={field.value} />
                          ) : (
                            <div className="flex items-center m-4 gap-3">
                              <UserIcon className="w-[18px] h-[18px]" />
                              <span>No one selected</span>
                            </div>
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {project?.users.map((user) => (
                          <SelectItem value={user.userId} key={user.userId}>
                            <div className="flex items-center gap-1">
                              <UserAvatar
                                avatarSize={6}
                                fontSize={10}
                                username={user.user.name}
                              />
                              {user.user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between m-2">
            <GeneralAccordion
              styling={{ accordionClassname: 'w-[40%]' }}
              trigger={'Description'}
              defaultOpen
            >
              <div className="p-1">
                <Textarea
                  className="min-h-[150px]"
                  {...form.register('description')}
                  placeholder="Add task description here."
                />
              </div>
            </GeneralAccordion>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={PriorityType.LOW}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Task Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(PriorityType).map((type) => (
                        <SelectItem value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={PriorityType.LOW}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(TaskStatusType).map((type) => (
                        <SelectItem value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </FormProvider>
    </main>
  )
}

export default CreateTaskPage
