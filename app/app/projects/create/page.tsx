'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { PriorityType, StatusType, type Tag, type User } from '@prisma/client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import CalendarSelect from '@src/components/Select/CalendarSelect'
import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import { Card, CardContent } from '@src/components/ui/card'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs'
import { Textarea } from '@src/components/ui/textarea'
import { postResource } from '@src/lib/api/postResource'
import { ProjectSchema } from '@src/lib/schemas'
import { capitalize } from '@src/lib/utils'
import {
  Calendar,
  Flag,
  Folder,
  Lightbulb,
  MessageCircleWarning,
  Milestone,
  Plus,
  Save,
  Trash2,
  Undo,
  Users,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'
import type { z } from 'zod'

const CreateProjectForm = () => {
  // Dynamic Page Params
  const params = useParams() as { name: string }

  // Routing used to return to previous page.
  const router = useRouter()

  // States
  const [isPending, startTransition] = useTransition()
  const [managerIds, setManagerIds] = useState<string[]>([])
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [milestones, setMilestones] = useState<
    { title: string; dueDate: Date }[]
  >([])
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDueDate, setMilestoneDueDate] = useState<Date>(new Date())

  const { data: users } = useSWR<User[]>('team/member')
  const { data: tags } = useSWR<Tag[]>('tag')

  // Form Logic and Functions
  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      priority: PriorityType.LOW,
      status: StatusType.ON_HOLD,
      budget: 0,
      teamId: '',
      tags: [],
      users: [],
    },
  })

  const onSubmit = (vals: z.infer<typeof ProjectSchema>) => {
    startTransition(() => {
      // Combine manager and member IDs
      vals.users = [...managerIds, ...memberIds]

      // Add milestones data (in a real app, you'd handle this properly)
      const projectData = {
        ...vals,
        milestones: milestones,
      }

      // Optimistically update SWR cache globally
      const projectKey = 'project'

      postResource('project', projectData)
        .then(() => {
          mutate(projectKey)
          router.back()
        })
        .catch(() => {
          mutate(projectKey)
        })
    })
  }

  const addMilestone = () => {
    if (milestoneTitle.trim() !== '') {
      setMilestones([
        ...milestones,
        { title: milestoneTitle, dueDate: milestoneDueDate },
      ])
      setMilestoneTitle('')
      setMilestoneDueDate(new Date())
    }
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const getManagersAndMembers = () => {
    const managers = users?.filter((user) => managerIds.includes(user.id)) || []
    const members = users?.filter((user) => memberIds.includes(user.id)) || []
    return { managers, members }
  }

  const { managers, members } = getManagersAndMembers()

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-5">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-4 dark:text-white">
            <div>
              <span className="text-2xl font-bold">Create Project</span>
              <p className="text-sm text-muted-foreground">
                Fill out the information to create a new Project
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {form.formState.isDirty ? (
              <ConfirmationDialog
                dialogTitle={'Discard changes?'}
                dialogDesc={'All progress will be lost'}
                submitButtonText={'Return'}
                onConfirmation={() => router.push(`/app/${params.name}`)}
              >
                <Button type="button" variant="outline" className="gap-2">
                  <Undo width={16} />
                  Cancel
                </Button>
              </ConfirmationDialog>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => router.back()}
              >
                <Undo width={16} />
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant={form.watch().name.length < 1 ? 'outline' : 'auth'}
              className={'gap-2'}
              aria-label="Save Project Button"
              disabled={isPending || !form.formState.isDirty}
            >
              <Save width={16} />
              <span>Save Project</span>
            </Button>
          </div>
        </div>

        <div className="form-group">
          <div className="min-h-[30px] text-sm flex items-center gap-2">
            <Folder className="w-4 h-4" />
            <span className="font-bold">Project Title</span>
            {form.watch().name.length < 1 ? (
              <div className="flex items-center gap-2 text-red-500 ">
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
                    placeholder="Enter Project Name"
                    type="text"
                    autoComplete="off"
                    className="text-lg font-medium"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2 bg-background">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Project Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field: { ref, ...field } }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
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
                                className="w-full"
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

                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Timeline & Priority
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                                  <div className="flex items-center gap-2">
                                    <Flag
                                      className={`w-4 h-4 ${
                                        type === 'HIGH'
                                          ? 'text-red-500'
                                          : type === 'MEDIUM'
                                            ? 'text-amber-500'
                                            : 'text-blue-500'
                                      }`}
                                    />
                                    {capitalize(type.replace('_', ' '))}
                                  </div>
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
                    <Milestone className="w-5 h-5 text-purple-500" />
                    Milestones
                  </h3>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label htmlFor="milestone-title">Title</Label>
                        <Input
                          id="milestone-title"
                          value={milestoneTitle ?? ''}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                          placeholder="Enter milestone title"
                        />
                      </div>
                      <div className="w-40">
                        <Label>Due Date</Label>
                        <CalendarSelect
                          onChange={(date) =>
                            setMilestoneDueDate(date ?? new Date())
                          }
                          value={milestoneDueDate ?? new Date()}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addMilestone}
                        disabled={!milestoneTitle.trim()}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>

                    {milestones.length > 0 ? (
                      <ScrollArea className="h-[200px] border rounded-md p-4">
                        <div className="space-y-3">
                          {milestones.map((milestone, index) => (
                            <div
                              key={milestone.title}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                  <Milestone className="w-4 h-4 text-purple-500" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {milestone.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Due:{' '}
                                    {milestone.dueDate.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMilestone(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] border rounded-md p-4 bg-muted/20">
                        <Milestone className="w-12 h-12 text-muted mb-2" />
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
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  Team Members
                </h3>

                <Tabs defaultValue="managers" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="managers">Managers</TabsTrigger>
                    <TabsTrigger value="members">Team Members</TabsTrigger>
                  </TabsList>

                  <TabsContent value="managers" className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={(value) => {
                          if (!managerIds.includes(value)) {
                            setManagerIds([...managerIds, value])
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add Project Manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            ?.filter(
                              (user) =>
                                !managerIds.includes(user.id) &&
                                !memberIds.includes(user.id),
                            )
                            .map((user) => (
                              <SelectItem
                                value={user.id}
                                key={`manager-select-${user.id}`}
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
                    </div>

                    <ScrollArea className="h-[250px] border rounded-md p-2">
                      <div className="space-y-3">
                        {managers.length > 0 ? (
                          managers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                            >
                              <div className="flex items-center space-x-3">
                                <UserAvatar
                                  avatarSize={36}
                                  username={user.name}
                                  fontSize={14}
                                />
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="mr-2">
                                Manager
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setManagerIds(
                                    managerIds.filter((id) => id !== user.id),
                                  )
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px]">
                            <Users className="w-12 h-12 text-muted mb-2" />
                            <p className="text-muted-foreground">
                              No managers assigned
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Add project managers to lead this project
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="members" className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={(value) => {
                          if (
                            !memberIds.includes(value) &&
                            !managerIds.includes(value)
                          ) {
                            setMemberIds([...memberIds, value])
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add Team Member" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            ?.filter(
                              (user) =>
                                !memberIds.includes(user.id) &&
                                !managerIds.includes(user.id),
                            )
                            .map((user) => (
                              <SelectItem
                                value={user.id}
                                key={`member-select-${user.id}`}
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
                    </div>

                    <ScrollArea className="h-[250px] border rounded-md p-2">
                      <div className="space-y-3">
                        {members.length > 0 ? (
                          members.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                            >
                              <div className="flex items-center space-x-3">
                                <UserAvatar
                                  avatarSize={36}
                                  username={user.name}
                                  fontSize={14}
                                />
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="mr-2">
                                Member
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setMemberIds(
                                    memberIds.filter((id) => id !== user.id),
                                  )
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px]">
                            <Users className="w-12 h-12 text-muted mb-2" />
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
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
