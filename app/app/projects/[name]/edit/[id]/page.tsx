'use client'
import Loading from '@/app/loading'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import { PriorityType, TaskStatusType, TaskType } from '@prisma/client'
import {
  UpdateTaskSchema,
  type UpdateTaskType,
} from '@server/domain/taskSchema'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import ClearButton from '@src/components/Buttons/ClearButton'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import { ConfirmationDialog } from '@src/components/Dialogs/ConfirmationDialog'
import GeneralAccordion from '@src/components/GeneralAccordion'
import PageHeader from '@src/components/PageHeader'
import CalendarSelect from '@src/components/Select/CalendarSelect'
import { Button } from '@src/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@src/components/ui/multiselect'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import { Textarea } from '@src/components/ui/textarea'
import { isTaskTypeContainer } from '@src/lib/helpers/TaskTypeHelpers'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { capitalize } from '@src/lib/utils'
import {
  BookOpenCheck,
  FileEdit,
  Loader2,
  MessageCircleWarning,
  Save,
  Undo,
  User as UserIcon,
} from 'lucide-react'
import { notFound, useRouter } from 'next/navigation'
import { use, useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const EditTaskPage = ({
  params,
}: { params: Promise<{ name: string; id: string }> }) => {
  // Dynamic Page Params
  const { id } = use(params)

  // Routing used to return to previous page.
  const router = useRouter()
  const ctx = useContext(ProjectDataContext)

  // Hooks
  const { data: task, isLoading: isTaskLoading } =
    apiRequest.task.fetchById.useQuery(ctx?.projectId ?? '', id)
  const { data: tasks } = apiRequest.task.fetchByProject.useQuery(
    ctx?.projectId ?? '',
  )

  const { data: users } = apiRequest.project.fetchAssignees.useQuery(
    ctx?.projectId ?? '',
  )
  const { data: tags } = apiRequest.tag.fetchAll.useQuery()

  const { mutate: updateTaskMutation, isPending } =
    apiRequest.task.update.useMutation(ctx?.projectId ?? '')

  // Form Logic and Functions
  const form = useForm<UpdateTaskType>({
    resolver: zodResolver(UpdateTaskSchema),
  })

  useEffect(() => {
    if (task) {
      form.reset({
        id: task.id,

        description: task?.description,
        title: task?.title ?? '',
        assignedToId: task?.assignedToId,
        startDate: new Date(task?.startDate),
        dueDate: new Date(task?.dueDate),

        priority: task?.priority ?? PriorityType.LOW,
        status: task?.status ?? TaskStatusType.NEW,
        type: task?.type ?? TaskType.TASK,
        projectId: task?.projectId,

        tags: task?.tags.map((t) => t.id),
        newTags: [],
        parentId: task?.parentId ?? null,

        subtasks: task.subtasks.map((t) => t.id),
      })
    } else {
      form.reset({
        id: '',
        assignedToId: null,
        description: '',
        title: '',
        dueDate: new Date(),
        startDate: new Date(),
        priority: PriorityType.LOW,
        projectId: '',
        status: TaskStatusType.NEW,
        tags: [],
        newTags: [],
        subtasks: [],
        parentId: null,
        type: TaskType.TASK,
      })
    }
  }, [task, form.reset])

  const onSubmit = (vals: UpdateTaskType) => {
    if (vals.assignedToId === 'undefined' || vals.assignedToId === '') {
      vals.assignedToId = null
    }

    if (!ctx?.projectId) {
      return
    }

    updateTaskMutation({ id, data: vals })
  }

  if (isTaskLoading) {
    return <Loading />
  }

  if (!task) {
    notFound()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader
          title="Edit Task"
          description="Update task details, adjust scheduling, change assignment, set priority and status, manage tags, and link related work."
          icon={FileEdit}
        >
          <div className="flex items-center gap-3 flex-col md:flex-row">
            <ConfirmationDialog
              title={'Discard changes?'}
              description={'All progress will be lost'}
              onCancel={() => null}
              onSubmit={() => router.back()}
            >
              <Button type="button" variant="ghost" className="gap-2">
                <Undo className="w-4 h-4" />
                Cancel
              </Button>
            </ConfirmationDialog>

            <Button
              type="submit"
              variant={!form.formState.isDirty ? 'outline' : 'secondary'}
              className={'gap-2'}
              aria-label="Save Task Button"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Task</span>
            </Button>
          </div>
        </PageHeader>

        <div className="form-group pt-5">
          <div className="min-h-[30px] text-sm flex items-center gap-3">
            <span className="flex gap-1 text-text-secondary items-center">
              {getTaskTypeIcon(task?.type.toUpperCase() as TaskType)}
              {`${task?.type.toUpperCase()} ${task?.taskCode}`}
            </span>
            {form.watch().title?.length < 1 ? (
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
                              field.value?.replace('_', ' ') ?? 'placeholder',
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
                              field.value?.replace('_', ' ') ?? 'placeholder',
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
            <div className="p-1">
              {!isTaskTypeContainer(form.getValues('type')) ? (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Link to Parent</Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
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
                          {tasks
                            ?.filter((t) => t.id !== id)
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
              ) : null}
              {/* 
              <div className="p-1 mt-2">
                <SubTasksGroup
                  projectName={name}
                  tasks={task?.subtasks ?? []}
                  mutate={updateTask}
                />
              </div>
              <AddSubtaskDialog
                key={'link-subtask-dialog'}
                parentId={params.id}
                subTasks={
                  tasks?.filter(
                    (t) =>
                      t.parentId !== params.id && !isTaskTypeContainer(t.type),
                  ) ?? []
                }
                mutate={() => {
                  updateTask()
                  updateTasks()
                }}
              >
                <Button className="mt-5" size={'sm'} variant={'default'}>
                  Link Subtask
                </Button>
              </AddSubtaskDialog> */}
            </div>
          </GeneralAccordion>
        </div>
      </form>
    </FormProvider>
  )
}

export default EditTaskPage
