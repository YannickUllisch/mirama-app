'use client'
import Loading from '@/app/loading'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import { PriorityType, StatusType } from '@prisma/client'
import { AttachNewMilestoneToProjectSchema } from '@server/domain/milestoneSchema'
import {
  type UpdateProjectInput,
  UpdateProjectSchema,
} from '@server/domain/projectSchema'
import { CreateTagSchema } from '@server/domain/tagSchema'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import { ConfirmationDialog } from '@src/components/Dialogs/ConfirmationDialog'
import PageHeader from '@src/components/PageHeader'
import CalendarSelect from '@src/components/Select/CalendarSelect'
import { Button } from '@src/components/ui/button'
import { Card, CardContent } from '@src/components/ui/card'
import { Checkbox } from '@src/components/ui/checkbox'
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
import { ScrollArea } from '@src/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import { Textarea } from '@src/components/ui/textarea'
import { capitalize } from '@src/lib/utils'
import { Badge } from '@ui/badge'
import Centering from '@ui/centering'
import { ColorPicker } from '@ui/color-picker'
import {
  Archive,
  ArchiveRestore,
  Calendar,
  ClipboardPen,
  Loader2,
  MessageCircleWarning,
  MilestoneIcon,
  PenIcon,
  Plus,
  Save,
  ShoppingCart,
  TagIcon,
  Text,
  Trash2,
  Undo,
  Users,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 } from 'uuid'

const CreateProjectForm = ({ params }: { params: Promise<{ id: string }> }) => {
  // Dynamic Page Params
  const { id } = use(params)

  // Routing used to return to previous page.
  const router = useRouter()

  // States
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: new Date(),
    colors: '',
  })
  const [newTag, setNewTag] = useState('')

  // Hooks
  const { data: project, isLoading } = apiRequest.project.fetchById.useQuery(id)
  const { data: users } = apiRequest.team.fetchMembers.useQuery()
  const { data: tags } = apiRequest.tag.fetchAll.useQuery()

  const { mutate: updateProjectMutation, isPending } =
    apiRequest.project.update.useMutation()

  const { mutate: archiveProjectMutationm, isPending: isArchivePending } =
    apiRequest.project.archive.useMutation()

  const { mutate: deleteProjectMutation, isPending: isDeletePending } =
    apiRequest.project.delete.useMutation()

  // Form Logic and Functions
  const form = useForm<UpdateProjectInput>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      priority: PriorityType.LOW,
      status: StatusType.ON_HOLD,
      budget: 0,
      tags: [],
      newTags: [],
      users: [],
      milestones: [],
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (project) {
      form.reset({
        ...project,
        milestones: project.milestones.map((m) => ({ ...m })),
        tags: project.tags.map((t) => t.id),
        newTags: [],
        users: project.users.map((u) => ({
          isManager: u.isManager,
          userId: u.id,
        })),
      })
    }
  }, [project])

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control: form.control,
    name: 'users',
  })

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    control: form.control,
    name: 'milestones',
  })

  const handleAddMilestone = () => {
    const { success, data } =
      AttachNewMilestoneToProjectSchema.safeParse(newMilestone)
    if (success) {
      appendMilestone({ ...data, id: v4() })
      setNewMilestone({ title: '', date: new Date(), colors: '' })
    }
  }

  const handleAddTag = () => {
    const result = CreateTagSchema.safeParse({ title: newTag })
    if (result.success) {
      // In a real app, you'd create the tag via API first
      // For now, we'll just add it to the form
      const currentTags = form.getValues('newTags')
      const titles = currentTags.map((t) => t.title)
      if (!titles.includes(newTag)) {
        form.setValue('newTags', [...currentTags, { title: newTag }], {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      setNewTag('')
    }
  }

  const toggleUserManager = (index: number) => {
    const currentValue = form.getValues(`users.${index}.isManager`)
    form.setValue(`users.${index}.isManager`, !currentValue, {
      shouldValidate: true,
    })
  }

  const handleAddUser = (userId: string) => {
    const exists = userFields.some((field) => field.userId === userId)
    if (!exists) {
      appendUser({ userId, isManager: false })
    }
  }

  const onSubmit = (vals: UpdateProjectInput) => {
    updateProjectMutation({ id, data: vals })
  }

  const onDelete = () => {
    deleteProjectMutation(id, {
      onSuccess: () => router.push('/app/projects'),
      onError: (err) => {
        toast.error(`Project could not be deleted ${err.message}`)
      },
    })
  }

  const onArchive = () => {
    archiveProjectMutationm(
      { id, archive: project?.archived !== true },
      {
        onError: (err) => {
          toast.error(`Project could not be deleted ${err.message}`)
        },
      },
    )
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const memoizedNewTags = useMemo(() => {
    return form.watch('newTags').map((t) => (
      <Badge
        variant={'accent'}
        key={`new-tag-badge-${t.title}`}
        onClick={() =>
          form.setValue(
            'newTags',
            form.watch('newTags').filter((newTag) => newTag.title !== t.title),
            {
              shouldValidate: true,
              shouldDirty: true,
            },
          )
        }
        className="gap-2 hover:bg-destructive hover:text-white cursor-pointer"
      >
        {t.title}
        <X className="w-3 h-3" />
      </Badge>
    ))
  }, [form.watch('newTags')])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-[50px]"
      >
        <PageHeader
          title="Update Project"
          description="View and manage your project"
          icon={PenIcon}
        >
          <div className="flex items-center gap-3 flex-col md:flex-row">
            <ConfirmationDialog
              title={'Discard changes?'}
              description={'All progress will be lost'}
              onCancel={() => null}
              onSubmit={() => router.push('/app/projects')}
            >
              <Button
                type="button"
                variant="ghost"
                className="gap-2 bg-transparent"
              >
                <Undo className="w-4 h-4" />
                Cancel
              </Button>
            </ConfirmationDialog>

            <Button
              type="submit"
              variant={!form.formState.isDirty ? 'outline' : 'secondary'}
              className={'gap-2'}
              aria-label="Save Project Button"
              disabled={
                isPending ||
                !form.formState.isDirty ||
                isDeletePending ||
                isArchivePending
              }
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Project</span>
            </Button>
          </div>
        </PageHeader>

        <Card>
          <CardContent>
            <div className="form-group">
              <div className="min-h-[30px] justify-between flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardPen className="w-5 h-5" />
                  <h3 className="font-medium">Project Title</h3>
                  {form.watch().name.length < 1 ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <MessageCircleWarning className="w-[15px] h-[15px]" />{' '}
                      {'Field "Name" cannot be empty.'}{' '}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <Centering>
                  <ConfirmationDialog
                    title={'Archive project?'}
                    description={
                      'Are you sure you want to archive this project?'
                    }
                    onCancel={() => null}
                    onSubmit={onArchive}
                  >
                    <Button
                      type="button"
                      size={'icon'}
                      variant="ghost"
                      className="gap-2"
                    >
                      {project?.archived ? (
                        <ArchiveRestore className="w-4 h-4" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </Button>
                  </ConfirmationDialog>
                  <ConfirmationDialog
                    title={'Delete project?'}
                    description={
                      'All data will be lost and can not be recovered'
                    }
                    onCancel={() => null}
                    onSubmit={onDelete}
                  >
                    <Button
                      type="button"
                      size={'icon'}
                      variant="ghost"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </ConfirmationDialog>
                </Centering>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full mt-2">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="text"
                        autoComplete="off"
                        className="text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-accent-foreground" />
                    Timeline & Priority
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <CalendarSelect
                            onChange={field.onChange}
                            value={field.value ?? ''}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
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
                        <FormItem>
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
                              {Object.keys(StatusType).map((type) => (
                                <SelectItem
                                  key={`status-item-${type}`}
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
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <MilestoneIcon className="w-5 h-5 text-accent-foreground" />
                    Milestones
                  </h3>

                  <div className="space-y-4">
                    <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-[1fr_160px_160px_auto] items-end">
                      <div className="flex flex-col">
                        <Label htmlFor="milestone-title">Title</Label>
                        <Input
                          id="milestone-title"
                          value={newMilestone.title}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter milestone title"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex flex-col">
                        <Label>Due Date</Label>
                        <div className="mt-1">
                          <CalendarSelect
                            onChange={(date) =>
                              setNewMilestone({
                                ...newMilestone,
                                date: date ?? new Date(),
                              })
                            }
                            value={newMilestone.date}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:ml-10">
                        <Label>Color</Label>
                        <div className="mt-1">
                          <ColorPicker
                            onChange={(color) =>
                              setNewMilestone({
                                ...newMilestone,
                                colors: color,
                              })
                            }
                            value={newMilestone.colors}
                          />
                        </div>
                      </div>

                      <div className="flex md:justify-end">
                        <Button
                          type="button"
                          onClick={handleAddMilestone}
                          disabled={newMilestone.title.length < 4}
                          className="gap-1 w-full md:w-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {milestoneFields.length > 0 ? (
                      <ScrollArea className="h-[200px] border rounded-md p-4">
                        <div className="space-y-3">
                          {milestoneFields.map((milestone, index) => (
                            <div
                              key={milestone.id}
                              className="flex items-center justify-between p-3 bg-accent text-accent-foreground rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-accent p-2 rounded-full">
                                  <MilestoneIcon className="w-4 h-4 text-accent-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {milestone.title}
                                  </p>
                                  <p className="text-sm ">
                                    Due:{' '}
                                    {new Date(
                                      milestone.date,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => removeMilestone(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] border rounded-md p-4 bg-secondary/10">
                        <MilestoneIcon className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No milestones added yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add key project milestones to track progress
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <TagIcon className="w-5 h-5 text-accent-foreground" />
                    Tags
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field: { ref, ...field } }) => (
                        <FormItem>
                          <FormLabel>Select Existing Tags</FormLabel>
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
                                  tags?.find((tag) => tag.id === item)?.title ||
                                  item
                                }
                                className="w-full"
                              >
                                <MultiSelectorInput placeholder="Select tags" />
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

                    <div className="flex gap-2">
                      <Input
                        placeholder="Create new tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={newTag.length < 2}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-col md:flex-row p-2">
                    {memoizedNewTags}
                  </div>
                </div>

                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-accent-foreground" />
                  Expense Management
                </h3>
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? ''
                                : Number(e.target.value),
                            )
                          }
                          value={field.value ?? ''}
                          placeholder="Enter budget amount"
                          className="max-w-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 text-text">
                  <Users className="w-5 h-5" />
                  Team Members
                </h3>

                <div className="space-y-4">
                  <Select onValueChange={handleAddUser}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add Team Member" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        ?.filter(
                          (user) =>
                            !userFields.some(
                              (field) => field.userId === user.id,
                            ),
                        )
                        .map((user) => (
                          <SelectItem
                            value={user.id}
                            key={`user-select-${user.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <UserAvatar
                                avatarSize={24}
                                fontSize={10}
                                username={user.name}
                              />
                              {user.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <ScrollArea className="h-[400px] border rounded-md p-2">
                    <div className="space-y-3">
                      {userFields.length > 0 ? (
                        userFields.map((userField, index) => {
                          const user = users?.find(
                            (u) => u.id === userField.userId,
                          )

                          if (!user) return null

                          return (
                            <div
                              key={userField.id}
                              className="flex items-center justify-between p-3 bg-accent rounded-md"
                            >
                              <div className="flex items-center space-x-3 flex-1 text-accent-foreground">
                                <UserAvatar
                                  avatarSize={36}
                                  username={user.name}
                                  fontSize={14}
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm">{user.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 text-accent-foreground">
                                  <Checkbox
                                    id={`manager-${userField.id}`}
                                    checked={form.watch(
                                      `users.${index}.isManager`,
                                    )}
                                    onCheckedChange={() =>
                                      toggleUserManager(index)
                                    }
                                  />
                                  <Label
                                    htmlFor={`manager-${userField.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    Manager
                                  </Label>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => removeUser(index)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[350px]">
                          <Users className="w-12 h-12 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            No team members assigned
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Add team members to work on this project
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Text className="w-5 h-5 text-accent-foreground" />
                  Description
                </h3>

                <Textarea
                  className="min-h-[200px]"
                  {...form.register('description')}
                  placeholder="Describe the project goals, scope, and other important details..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateProjectForm
