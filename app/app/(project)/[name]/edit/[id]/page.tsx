'use client'
import { Button } from '@src/components/ui/button'
import {
  PriorityType,
  type ProjectUser,
  type Project,
  type Tag,
  type Task,
  type User,
  TaskStatusType,
} from '@prisma/client'
import {
  BookCheck,
  CalendarIcon,
  MessageCircleWarning,
  Save,
  Undo,
  UserIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'
import useSWR from 'swr'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskSchema } from '@src/lib/schemas'
import { updateResourceById } from '@src/lib/api/updateResource'
import { Separator } from '@src/components/ui/separator'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@src/components/ui/multiselect'
import GeneralAccordion from '@src/components/GeneralAccordion'
import { Textarea } from '@src/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@src/components/ui/calendar'

const EditTaskPage = ({ params }: { params: { id: string } }) => {
  const { data: task } = useSWR<
    Task & {
      assignedTo: User
      tags: Tag[]
      project: Project & { users: ProjectUser & { user: User }[] }
    }
  >(`/api/db/task/${params.id}`)

  const router = useRouter()

  const { data: tags } = useSWR<Tag[]>('/api/db/tag')

  const [datePopup, setDatePopup] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      assignedToId: 'undefined',
      description: '',
      title: '',
      dueDate: new Date(),
      priority: PriorityType.LOW,
      projectId: '',
      status: TaskStatusType.TODO,
      tags: [],
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        assignedToId: task.assignedToId ?? 'undefined',
        description: task.description,
        title: task.title,
        dueDate: new Date(task.dueDate ?? ''),
        priority: task.priority as PriorityType,
        projectId: task.projectId,
        status: task.status as TaskStatusType,
        tags: task.tags.map((tag) => tag.id),
      })
      console.log(form.getValues())
    }
  }, [task, form])

  const onSubmit = (vals: z.infer<typeof TaskSchema>) => {
    startTransition(() => {
      console.log('here')

      // To make returning to unassigned state possible, we have to reset the undefined string
      if (vals.assignedToId === 'undefined' || vals.assignedToId === '')
        vals.assignedToId = null
      updateResourceById('task', task?.id ?? '', vals).then(() => {
        router.back()
      })
    })
  }

  if (!task) return null

  if (!form) return null

  return (
    <main className="flex flex-col">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <div className="flex items-center gap-4 dark:text-white">
              <BookCheck width={20} />
              <span style={{ fontSize: 20 }}>Edit Task</span>
              <div>|</div>
              <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Undo width={10} className="ml-2" />
                <Button
                  type="button"
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
                className={`flex items-center text-text rounded-sm cursor-pointer ${
                  form.watch().title.length < 1
                    ? 'bg-neutral-100 dark:bg-neutral-900 dark:text-accent'
                    : 'bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-700 text-white'
                }`}
                aria-label="Save Task Button"
              >
                <Save width={15} className="ml-2" />
                <Button
                  type="submit"
                  className={`disabled:bg-red-500 ${
                    form.watch().title.length < 1
                      ? 'text-text dark:text-accent'
                      : 'text-white'
                  }`}
                  style={{
                    fontSize: 11,
                    textDecoration: 'none',
                  }}
                  variant="link"
                  disabled={isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
          <Separator className="mt-2 mb-2" />

          <div className="form-group">
            <div className="min-h-[30px] text-sm flex items-center gap-3">
              {form.watch().title.length < 1 ? (
                <div className="flex items-center gap-2 text-red-500 ">
                  <MessageCircleWarning className="w-[15px] h-[15px]" />{' '}
                  {'Field "Title" cannot be empty.'}{' '}
                </div>
              ) : (
                ''
              )}
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
                </FormItem>
              )}
            />

            <div className="flex justify-start gap-2 mt-2">
              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? 'undefined'}
                    >
                      <FormControl>
                        <SelectTrigger className="border dark:border-neutral-800 w-[200px]">
                          <SelectValue className="m-4 flex items-center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'undefined'} key={'reset-item'}>
                          <div className="flex items-center gap-4 ml-1">
                            <UserIcon className="w-[18px]" />
                            <span>Unassigned</span>
                          </div>
                        </SelectItem>
                        {task?.project?.users.map((user) => (
                          <SelectItem
                            value={user.user.id}
                            key={`user-item-${user.user.id}`}
                          >
                            <div className="flex items-center gap-4">
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

              <div className="flex items-center gap-1 pl-5">
                Tags:
                <FormField
                  control={form.control}
                  name="tags"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <MultiSelector
                        {...form.register('tags')}
                        values={field.value ?? []}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <FormControl>
                          <MultiSelectorTrigger
                            renderValue={(item) => {
                              const tag = tags?.find((tag) => tag.id === item)
                              return tag ? tag.title : item
                            }}
                          >
                            <MultiSelectorInput placeholder="Add Tag" />
                          </MultiSelectorTrigger>
                        </FormControl>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {tags?.map((tag) => (
                              <MultiSelectorItem
                                value={tag.id}
                                key={`tag${tag.id}`}
                              >
                                {tag.title}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between m-2 gap-5">
            <GeneralAccordion
              styling={{ accordionClassname: 'w-[50%]' }}
              trigger={'Description'}
              defaultOpen
            >
              <div className="p-1">
                <Textarea
                  disabled={isPending}
                  className="min-h-[150px]"
                  {...form.register('description')}
                  placeholder="Add task description here."
                />
              </div>
            </GeneralAccordion>

            <GeneralAccordion
              styling={{ accordionClassname: 'w-[50%]' }}
              trigger={'Planning'}
              defaultOpen
            >
              <div className="p-1 ">
                <FormField
                  control={form.control}
                  name="priority"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Task Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(PriorityType).map((type) => (
                            <SelectItem
                              key={`priority-item-${type}`}
                              value={type}
                            >
                              {type}
                            </SelectItem>
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
                    <FormItem className="mt-5">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(TaskStatusType).map((type) => (
                            <SelectItem
                              key={`status-item-${type}`}
                              value={type}
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="mt-5 flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover
                        open={datePopup}
                        onOpenChange={() => setDatePopup((curr) => !curr)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={'justify-start text-left bg-transparent'}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : ''}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            onSelect={field.onChange}
                            selected={field.value ?? new Date()}
                            className="dark:focus:bg-red-500 rounded-md border shadow dark:bg-neutral-900 dark:border-neutral-800"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </GeneralAccordion>
          </div>
        </form>
      </FormProvider>
    </main>
  )
}

export default EditTaskPage
