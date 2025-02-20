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
  type Tag,
  type Task,
  TaskStatusType,
  type TaskType,
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
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { postResource } from '@src/lib/api/postResource'
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
import ClearButton from '@src/components/Buttons/ClearButton'
import useSWR from 'swr'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { isTaskTypeContainer } from '@src/lib/helpers/TaskTypeHelpers'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import SubTasksGroup from '@src/components/Task/SubTasksGroup'
import AddSubtaskDialog from '@src/components/Dialogs/AddSubtaskDialog'

const CreateTaskForm = ({
  params,
}: { params: { name: string; type: string } }) => {
  // Routing used to return to previous page.
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultParentId = searchParams.get('parentId')
  const projectContext = useContext(ProjectDataContext)

  // States
  const [isPending, startTransition] = useTransition()

  const { data: tasks } = useSWR<Task[]>(
    projectContext ? `task?id=${projectContext?.projectId}` : undefined,
  )

  const { data: users } = useSWR<User[]>(
    projectContext ? `project/users?id=${projectContext?.projectId}` : '',
  )
  const { data: tags } = useSWR<Tag[]>('tag')

  // Form Logic and Functions
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      assignedToId: null,
      description: '',
      title: '',
      dueDate: new Date(),
      startDate: new Date(),
      priority: PriorityType.LOW,
      projectId: projectContext?.projectId,
      status: TaskStatusType.NEW,
      tags: [],
      subtasks: undefined,
      parentId:
        defaultParentId &&
        !isTaskTypeContainer(params.type.toUpperCase() as TaskType)
          ? defaultParentId
          : undefined,
      type: params.type.toUpperCase() as TaskType,
    },
  })

  const onSubmit = (vals: z.infer<typeof TaskSchema>) => {
    startTransition(() => {
      if (vals.assignedToId === 'undefined' || vals.assignedToId === '')
        vals.assignedToId = null
      // To make returning to unassigned state possible, we have to reset the undefined string
      postResource('task', vals).then(() => {
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
            <span style={{ fontSize: 20 }}>Create Task</span>
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
            <span className="flex gap-1 text-text-secondary items-center">
              {getTaskTypeIcon(params.type.toUpperCase() as TaskType)}
              {`NEW ${params.type.toUpperCase()}`}
            </span>
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
              <FormItem className="w-full">
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
        </div>

        <div className="mt-5">
          <Label>General Info</Label>
          <div className="grid p-2 grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    key={`assignedTo-select-${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border dark:border-neutral-800">
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
                      {users?.map((user) => (
                        <SelectItem
                          value={user.id}
                          key={`user-item-${user.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <UserAvatar
                              avatarSize={25}
                              fontSize={10}
                              username={user.name}
                            />
                            {user.name}
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
              name="tags"
              render={({ field: { ref, ...field } }) => (
                <FormItem>
                  <MultiSelector
                    {...form.register('tags')}
                    values={field.value ?? []}
                    onValuesChange={field.onChange}
                    loop
                    onBlur={field.onBlur}
                  >
                    <FormControl>
                      <MultiSelectorTrigger
                        renderValue={(item) =>
                          tags?.find((tag) => tag.id === item)?.title
                        }
                        className="w-full border-neutral-200 shadow-sm dark:border-neutral-800"
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

        <div className="flex justify-between m-2 gap-5 flex-col lg:flex-row">
          <GeneralAccordion
            styling={{ accordionClassname: 'w-full' }}
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

          <GeneralAccordion
            styling={{ accordionClassname: 'w-full' }}
            trigger={'Planning'}
            defaultOpen
          >
            <div className="p-1 ">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={`priority-select-${field.value}`}
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={`status-select-${field.value}`}
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="mt-5 flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <CalendarSelect
                      onChange={field.onChange}
                      value={field.value}
                    />
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
            styling={{ accordionClassname: 'lg:w-[80%]' }}
          >
            {!isTaskTypeContainer(form.getValues('type')) ? (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem className="p-1">
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
                        {tasks?.map((task) => (
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
            ) : null}
            <div className="p-1 mt-2">
              <SubTasksGroup
                projectName={params.name}
                tasks={
                  tasks?.filter((task) =>
                    form.getValues('subtasks')?.includes(task.id),
                  ) ?? []
                }
              />
            </div>
            <AddSubtaskDialog
              key={'link-subtask-dialog'}
              parentId={''}
              subTasks={
                tasks?.filter(
                  (t) =>
                    !form.getValues('subtasks')?.includes(t.id) &&
                    !isTaskTypeContainer(t.type),
                ) ?? []
              }
            >
              <Button className="mt-5" size={'sm'} variant={'default'}>
                Link Subtask
              </Button>
            </AddSubtaskDialog>
          </GeneralAccordion>
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateTaskForm
