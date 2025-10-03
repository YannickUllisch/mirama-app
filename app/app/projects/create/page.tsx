'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { PriorityType, StatusType, type Tag, type User } from '@prisma/client'
import { AttachMilestoneToProjectSchema } from '@server/domain/milestoneSchema'
import {
  type CreateProjectInput,
  CreateProjectSchema,
} from '@server/domain/projectSchema'
import { CreateTagSchema } from '@server/domain/tagSchema'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
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
import { postResource } from '@src/lib/api/postResource'
import { capitalize } from '@src/lib/utils'
import { ColorPicker } from '@ui/color-picker'
import {
  Calendar,
  ClipboardPen,
  MessageCircleWarning,
  Milestone,
  Plus,
  Save,
  ShoppingCart,
  TagIcon,
  Text,
  Trash2,
  Undo,
  Users,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

const CreateProjectForm = () => {
  // Dynamic Page Params
  const params = useParams() as { name: string }

  // Routing used to return to previous page.
  const router = useRouter()

  // States
  const [isPending, startTransition] = useTransition()

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: new Date(),
    colors: 'white',
  })
  const [newTag, setNewTag] = useState('')

  const { data: users } = useSWR<User[]>('team/member')
  const { data: tags } = useSWR<Tag[]>('tag')

  // Form Logic and Functions
  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      priority: PriorityType.LOW,
      status: StatusType.ON_HOLD,
      budget: 0,
      tags: [],
      users: [],
      milestones: [],
    },
  })

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
    const result = AttachMilestoneToProjectSchema.safeParse(newMilestone)
    if (result.success) {
      appendMilestone(result.data)
      setNewMilestone({ title: '', date: new Date(), colors: 'white' })
    }
  }

  const handleAddTag = () => {
    const result = CreateTagSchema.safeParse({ title: newTag })
    if (result.success) {
      // In a real app, you'd create the tag via API first
      // For now, we'll just add it to the form
      const currentTags = form.getValues('tags')
      if (!currentTags.includes(newTag)) {
        form.setValue('tags', [...currentTags, newTag], {
          shouldValidate: true,
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

  const onSubmit = (vals: CreateProjectInput) => {
    startTransition(() => {
      // Optimistically update SWR cache globally

      postResource('project', vals)
        .then(() => {
          mutate('project')
        })
        .catch(() => {
          mutate('project')
        })
    })
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-[50px]"
      >
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold">Create Project</span>
              <p className="text-sm text-muted-foreground">
                Fill out the information to create a new Project
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConfirmationDialog
              dialogTitle={'Discard changes?'}
              dialogDesc={'All progress will be lost'}
              submitButtonText={'Return'}
              onConfirmation={() => router.push(`/app/projects/${params.name}`)}
            >
              <Button
                type="button"
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <Undo className="w-4 h-4" />
                Cancel
              </Button>
            </ConfirmationDialog>

            <Button
              type="submit"
              variant={!form.formState.isDirty ? 'outline' : 'default'}
              className={'gap-2'}
              aria-label="Save Project Button"
              disabled={isPending || !form.formState.isDirty}
            >
              <Save className="w-4 h-4" />
              <span>Save Project</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent>
            <div className="form-group">
              <div className="min-h-[30px] flex items-center gap-2">
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
                    <Milestone className="w-5 h-5 text-accent-foreground" />
                    Milestones
                  </h3>

                  <div className="space-y-4">
                    <div className="flex gap-6 items-end">
                      <div className="flex-1">
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
                        />
                      </div>
                      <div className="w-40">
                        <Label>Due Date</Label>
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
                      <div className="w-40">
                        <Label>Color</Label>
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
                      <Button
                        type="button"
                        onClick={handleAddMilestone}
                        disabled={newMilestone.title.length < 4}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
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
                                  <Milestone className="w-4 h-4 text-accent-foreground" />
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
                        <Milestone className="w-12 h-12 text-muted-foreground" />
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
                            field.onChange(Number(e.target.value))
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
