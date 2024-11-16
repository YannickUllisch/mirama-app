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
  type Tag,
  type Task,
  type TaskCategory,
  TaskStatusType,
  type User,
} from '@prisma/client'
import {
  BookCheck,
  BookOpenCheck,
  MessageCircleWarning,
  Save,
  Undo,
  User as UserIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'
import type { z } from 'zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'
import GeneralAccordion from '@src/components/GeneralAccordion'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@src/components/ui/multiselect'
import CalendarSelect from '@src/components/Select/CalendarSelect'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import { capitalize } from '@src/lib/utils'
import { Label } from '@src/components/ui/label'
import SubTasksGroup from '@src/components/task/SubTasksGroup'
import { updateResourceById } from '@src/lib/api/updateResource'
import AddSubtaskDialog from '@src/components/Dialogs/AddSubtaskDialog'
import ClearButton from '@src/components/Buttons/ClearButton'

const EditTaskForm = ({ params }: { params: { id: string; name: string } }) => {
  // Routing used to return to previous page.
  const router = useRouter()

  const { data: task, mutate: updateTask } = useSWR<
    Task & {
      subtasks: Task[]
      tags: Tag[]
    }
  >(`/api/db/task/${params.id}`)

  const { data: project, mutate: updateProject } = useSWR<
    Project & {
      users: (ProjectUser & { user: User })[]
      taskCategories: TaskCategory[]
      tasks: Task[]
    }
  >(`/api/db/project/name/${params.name}`)

  const { data: tags } = useSWR<Tag[]>('/api/db/tag')

  // States
  const [isPending, startTransition] = useTransition()

  // Form Logic and Functions
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    values: {
      assignedToId: task?.assignedToId,
      description: task?.description,
      title: task?.title ?? '',
      dueDate: new Date(task?.dueDate ?? ''),
      priority: task?.priority ?? PriorityType.LOW,
      projectId: task?.projectId ?? '',
      status: task?.status ?? TaskStatusType.NOT_STARTED,
      tags: task?.tags.map((tag) => tag.id),
      parentId: task?.parentId ?? undefined,
      categoryId: task?.categoryId ?? undefined,
    },
    defaultValues: {
      assignedToId: undefined,
      description: '',
      title: '',
      dueDate: undefined,
      priority: PriorityType.LOW,
      projectId: task?.projectId,
      status: TaskStatusType.NOT_STARTED,
      tags: [],
      parentId: undefined,
      categoryId: undefined,
    },
  })

  // Functions
  const onSubmit = (vals: z.infer<typeof TaskSchema>) => {
    startTransition(() => {
      updateResourceById('task', task?.id ?? '', vals).then(() => {
        router.back()
      })
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <div className="flex items-center gap-4 dark:text-white">
            <BookCheck width={20} />
            <span style={{ fontSize: 20 }}>Edit Task</span>
            <div>|</div>
            {form.formState.isDirty ? (
              <ConfirmationDialog
                dialogTitle={'Are you sure?'}
                dialogDesc={'All progress will be lost'}
                submitButtonText={'Return'}
                onConfirmation={() => router.push(`/app/${params.name}`)}
              >
                <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                  <Undo width={10} className="ml-2" />
                  <Button
                    type="button"
                    style={{ textDecoration: 'none', fontSize: 12 }}
                    variant={'link'}
                  >
                    Return to Overview
                  </Button>
                </div>
              </ConfirmationDialog>
            ) : (
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
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className={`flex items-cente text-text rounded-sm cursor-pointer gap-2 ${
                form.watch().title.length < 1
                  ? 'bg-neutral-100 dark:bg-neutral-900 dark:text-accent'
                  : 'bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-700 text-white'
              }`}
              aria-label="Save Task Button"
              style={{
                fontSize: 11,
                textDecoration: 'none',
              }}
              disabled={isPending}
            >
              <Save width={15} />
              <span
                className={`disabled:bg-red-500 ${
                  form.watch().title.length < 1
                    ? 'text-text dark:text-accent'
                    : 'text-white'
                }`}
              >
                Save
              </span>
            </Button>
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
                    key={`assignedTo-select-${field.value}`}
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="border dark:border-neutral-800 w-[200px]">
                        <SelectValue
                          className="m-4 flex items-center"
                          placeholder={
                            <div className="flex items-center gap-4 ml-1">
                              <UserIcon className="w-[18px]" />
                              <span>Unassigned</span>
                            </div>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {project?.users.map((user) => (
                        <SelectItem
                          value={user.user.id}
                          key={`user-item-${user.user.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <UserAvatar
                              avatarSize={25}
                              fontSize={10}
                              username={user.user.name}
                            />
                            {user.user.name}
                          </div>
                        </SelectItem>
                      ))}
                      <ClearButton onClick={() => field.onChange(undefined)} />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    key={`category-select-${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger className="border dark:border-neutral-800 w-[200px]">
                        <SelectValue
                          placeholder={
                            <span className="text-text-secondary">
                              Select Category
                            </span>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {project?.taskCategories.map((category) => (
                        <SelectItem
                          key={`category-item-${category}`}
                          value={category.id}
                        >
                          {category.title}
                        </SelectItem>
                      ))}
                      <ClearButton onClick={() => field.onChange(undefined)} />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center pl-2 gap-2">
              <span>Tags: </span>
              <FormField
                control={form.control}
                name="tags"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <MultiSelector
                      id="tag-multi-select"
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
                              key={`tag-${tag.id}`}
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
            styling={{ accordionClassname: 'w-full' }}
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
            styling={{ accordionClassname: 'w-full' }}
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
                      key={`priority-select-${field.value ?? 'undefined'}`}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={capitalize(
                              field.value.replace('_', ' '),
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(PriorityType).map((type) => (
                          <SelectItem
                            key={`priority-item-${type}`}
                            value={type}
                          >
                            {capitalize(type.replace('_', ' '))}
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
                      key={`status-select-${field.value ?? 'undefined'}`}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={capitalize(
                              field.value.replace('_', ' '),
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(TaskStatusType).map((type) => (
                          <SelectItem key={`status-item-${type}`} value={type}>
                            {capitalize(type.replace('_', ' '))}
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
                    <CalendarSelect
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </GeneralAccordion>
          <GeneralAccordion
            trigger={'Related work'}
            defaultOpen
            styling={{ accordionClassname: 'w-[80%]' }}
          >
            <div className="p-1">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <Label>Link to Parent</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      key={`parent-select-${field.value}`}
                    >
                      <FormControl>
                        <SelectTrigger className="border dark:border-neutral-800 w-[200px]">
                          <SelectValue
                            className="m-4 flex items-center"
                            placeholder={
                              <span className="text-text-secondary">
                                Select Parent
                              </span>
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {project?.tasks
                          .filter((t) => t.id !== params.id)
                          .map((task) => (
                            <SelectItem
                              value={task.id}
                              key={`task-item-${task.id}}`}
                            >
                              <div className="flex gap-2">
                                <BookOpenCheck className="w-4 h-4" />
                                {task.title}
                              </div>
                            </SelectItem>
                          ))}
                        <ClearButton
                          onClick={() => field.onChange(undefined)}
                        />
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-1 mt-2">
                <SubTasksGroup
                  projectName={params.name}
                  tasks={task?.subtasks ?? []}
                  mutate={updateTask}
                />
              </div>
              <AddSubtaskDialog
                key={'link-subtask-dialog'}
                parentId={params.id}
                subTasks={
                  project?.tasks?.filter((t) => t.parentId !== params.id) ?? []
                }
                mutate={() => {
                  updateProject()
                  updateTask()
                }}
              >
                <Button className="mt-5" size={'sm'} variant={'default'}>
                  Link Subtask
                </Button>
              </AddSubtaskDialog>
            </div>
          </GeneralAccordion>
        </div>
      </form>
    </FormProvider>
  )
}

export default EditTaskForm
