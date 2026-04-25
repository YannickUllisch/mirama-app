// src/modules/project/components/ProjectForm.tsx
'use client'
import { PriorityType, StatusType } from '@/prisma/generated/client'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import { CreateTagSchema } from '@server/modules/account/tags/features/create-tag/schema'
import {
  MilestoneSchema,
  NewTagSchema,
  ProjectMemberLinkSchema,
  ProjectTeamLinkSchema,
} from '@server/modules/project/domain/project.schema'
import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
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
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import teamHooks from '@src/modules/organization/teams/hooks/hooks'
import { usePermissions } from '@src/modules/shared/permissions/PermissionContext'
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
  Milestone,
  PenIcon,
  Plus,
  PlusCircle,
  Save,
  ShieldOff,
  ShoppingCart,
  TagIcon,
  Text,
  Trash2,
  Undo,
  Users,
  Users2,
  X,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  FormProvider,
  type Resolver,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'

// ── Unified client-side form schema ──────────────────────────────────────────
// Sub-schemas are imported from the server domain so create, update, and this
// form all validate the same shapes without duplication.

const ProjectFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    priority: z.enum(PriorityType),
    status: z.enum(StatusType),
    budget: z.number(),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    members: z.array(ProjectMemberLinkSchema),
    teams: z.array(ProjectTeamLinkSchema).default([]),
    milestones: z.array(MilestoneSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

type ProjectFormValues = z.infer<typeof ProjectFormSchema>

// ── Props ─────────────────────────────────────────────────────────────────────

type ProjectFormProps = { mode: 'create' } | { mode: 'edit'; projectId: string }

// ── Component ─────────────────────────────────────────────────────────────────

const ProjectForm = (props: ProjectFormProps) => {
  const isEdit = props.mode === 'edit'
  const projectId = isEdit ? props.projectId : undefined

  const router = useRouter()
  const { data: session } = useSession()
  const { activeOrganizationId } = useOrganizationResource()
  const { can } = usePermissions()

  const canCreateProject = can('project', 'create')
  const canUpdateProject = can('project', 'update')
  const canCreateMilestone = can('milestone', 'create')
  const canCreateTag = can('tag', 'create')
  const canReadTag = can('tag', 'read')

  const hasAccess = isEdit ? canUpdateProject : canCreateProject

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: new Date(),
    colors: '',
  })
  const [newTag, setNewTag] = useState('')

  // Data queries
  const { data: project, isLoading: isProjectLoading } =
    apiRequest.project.fetchById.useQuery(projectId ?? '')
  const { data: orgMembers = [] } = apiRequest.members.fetchAll.useQuery()
  const { data: tags } = apiRequest.tag.fetchAll.useQuery()
  const { data: allTeams = [] } = teamHooks.fetchAll.useQuery()

  // Mutations
  const { mutate: createProject, isPending: isCreating } =
    apiRequest.project.create.useMutation()
  const { mutate: updateProject, isPending: isUpdating } =
    apiRequest.project.update.useMutation()
  const { mutate: archiveProject, isPending: isArchivePending } =
    apiRequest.project.archive.useMutation()
  const { mutate: deleteProject, isPending: isDeletePending } =
    apiRequest.project.delete.useMutation()

  const isPending = isEdit ? isUpdating : isCreating

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema) as Resolver<ProjectFormValues>,
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
      members: [],
      teams: [],
      milestones: [],
    },
  })

  // Populate form with existing project data in edit mode
  // biome-ignore lint/correctness/useExhaustiveDependencies: project identity is sufficient
  useEffect(() => {
    if (project && isEdit) {
      form.reset({
        name: project.name,
        description: project.description,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        priority: project.priority,
        status: project.status,
        budget: project.budget,
        tags: project.tags.map((t) => t.id),
        newTags: [],
        members: project.members
          .filter((m) => !m.isInherited)
          .map((m) => ({ memberId: m.id, isManager: false })),
        teams: project.teams.map((t) => ({ teamId: t.teamId })),
        milestones: project.milestones.map((m) => ({
          id: m.id,
          date: new Date(m.date),
          title: m.title,
          colors: m.colors,
        })),
      })
    }
  }, [project])

  // Field arrays
  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({ control: form.control, name: 'members' })

  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeam,
  } = useFieldArray({ control: form.control, name: 'teams' })

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({ control: form.control, name: 'milestones' })

  // Handlers
  const handleAddMilestone = () => {
    const result = MilestoneSchema.omit({ id: true }).safeParse(newMilestone)
    if (result.success) {
      appendMilestone(result.data)
      setNewMilestone({ title: '', date: new Date(), colors: '' })
    }
  }

  const handleAddTag = () => {
    const result = CreateTagSchema.safeParse({ title: newTag })
    if (result.success) {
      const current = form.getValues('newTags')
      if (!current.some((t) => t.title === newTag)) {
        form.setValue('newTags', [...current, { title: newTag }], {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      setNewTag('')
    }
  }

  const handleAddMember = (memberId: string) => {
    if (!memberFields.some((f) => f.memberId === memberId)) {
      appendMember({ memberId, isManager: false })
    }
  }

  const handleAddTeam = (teamId: string) => {
    if (!teamFields.some((f) => f.teamId === teamId)) {
      appendTeam({ teamId })
    }
  }

  const toggleMemberManager = (index: number) => {
    const current = form.getValues(`members.${index}.isManager`)
    form.setValue(`members.${index}.isManager`, !current, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onSubmit = (values: ProjectFormValues) => {
    const { milestones, ...sharedFields } = values

    if (isEdit && projectId) {
      updateProject(
        {
          id: projectId,
          data: { ...sharedFields, milestones },
        },
        {
          onSuccess: () => {
            form.reset(values)
          },
        },
      )
    } else {
      createProject(
        {
          ...sharedFields,
          archived: false,
          // Transform milestones: strip optional IDs for create
          newMilestones: milestones.map(({ id: _id, ...rest }) => rest),
        },
        {
          onSuccess(data) {
            if (data.id) {
              router.push(
                `/organization/${activeOrganizationId}/projects/edit/${data.id}`,
              )
            } else {
              router.push(`/organization/${activeOrganizationId}/projects`)
            }
          },
        },
      )
    }
  }

  const onArchive = () => {
    if (!projectId || !project) return
    archiveProject({ id: projectId, archive: !project.archived })
  }

  const onDelete = () => {
    if (!projectId) return
    deleteProject(projectId, {
      onSuccess: () =>
        router.push(`/organization/${activeOrganizationId}/projects`),
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: form.watch triggers correctly
  const memoizedNewTags = useMemo(
    () =>
      form.watch('newTags').map((t) => (
        <Badge
          variant="accent"
          key={`new-tag-badge-${t.title}`}
          onClick={() =>
            form.setValue(
              'newTags',
              form.watch('newTags').filter((tag) => tag.title !== t.title),
              { shouldValidate: true, shouldDirty: true },
            )
          }
          className="gap-2 hover:bg-destructive hover:text-white cursor-pointer"
        >
          {t.title}
          <X className="w-3 h-3" />
        </Badge>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.watch('newTags')],
  )

  // Access denied guard
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-100 gap-4 text-muted-foreground">
        <ShieldOff className="w-12 h-12" />
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-sm">
          You do not have permission to {isEdit ? 'edit' : 'create'} projects in
          this organization.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  // Loading state for edit mode
  if (isEdit && isProjectLoading) {
    return (
      <div className="flex items-center justify-center h-100">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const availableTeams = allTeams.filter(
    (t) => !teamFields.some((f) => f.teamId === t.id),
  )
  const availableMembers = orgMembers.filter(
    (m) => !memberFields.some((f) => f.memberId === m.id),
  )
  const creatorMember = !isEdit
    ? orgMembers.find((m) => m.email === session?.user?.email)
    : undefined

  const isAnyPending = isPending || isArchivePending || isDeletePending

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-12.5"
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <PageHeader
          title={isEdit ? 'Update Project' : 'Create Project'}
          description={
            isEdit
              ? 'View and manage your project'
              : 'Fill out the information to create a new Project'
          }
          icon={isEdit ? PenIcon : PlusCircle}
        >
          <div className="flex items-center gap-3 flex-col md:flex-row">
            <ConfirmationDialog
              title="Discard changes?"
              description="All progress will be lost"
              onCancel={() => null}
              onSubmit={() => router.back()}
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
              className="gap-2"
              aria-label="Save Project Button"
              disabled={isAnyPending || !form.formState.isDirty}
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

        {/* ── Title card ────────────────────────────────────────────────────── */}
        <Card className={isEdit ? undefined : 'bg-transparent border-none'}>
          <CardContent>
            <div className="form-group">
              <div className="min-h-7.5 justify-between flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardPen className="w-5 h-5" />
                  <h3 className="font-medium">Project Title</h3>
                  {form.watch('name').length < 1 && (
                    <div className="flex items-center gap-2 text-destructive">
                      <MessageCircleWarning className="w-3.75 h-3.75" />
                      {'Field "Name" cannot be empty.'}
                    </div>
                  )}
                </div>

                {/* Edit-only: archive / delete */}
                {isEdit && (
                  <Centering>
                    <ConfirmationDialog
                      title="Archive project?"
                      description="Are you sure you want to archive this project?"
                      onCancel={() => null}
                      onSubmit={onArchive}
                    >
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={isArchivePending}
                      >
                        {project?.archived ? (
                          <ArchiveRestore className="w-4 h-4" />
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                      </Button>
                    </ConfirmationDialog>

                    <ConfirmationDialog
                      title="Delete project?"
                      description="All data will be lost and can not be recovered"
                      onCancel={() => null}
                      onSubmit={onDelete}
                    >
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={isDeletePending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </ConfirmationDialog>
                  </Centering>
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
                        disabled={isAnyPending}
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

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <Card
            className={`col-span-1 lg:col-span-2 ${isEdit ? '' : 'bg-transparent border-none'}`}
          >
            <CardContent>
              <div className="space-y-6">
                {/* Timeline & Priority */}
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-accent-foreground" />
                    Timeline &amp; Priority
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
                            key={`priority-${field.value}`}
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
                                  key={`priority-${type}`}
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
                            key={`status-${field.value}`}
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
                                <SelectItem key={`status-${type}`} value={type}>
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

                {/* Milestones — gated on milestone:create */}
                {canCreateMilestone && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                      <Milestone className="w-5 h-5 text-accent-foreground" />
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
                              setNewMilestone((s) => ({
                                ...s,
                                title: e.target.value,
                              }))
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
                                setNewMilestone((s) => ({
                                  ...s,
                                  date: date ?? new Date(),
                                }))
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
                                setNewMilestone((s) => ({
                                  ...s,
                                  colors: color,
                                }))
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
                        <ScrollArea className="h-50 border rounded-md p-4">
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
                                    <p className="text-sm text-muted-foreground">
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
                        <div className="flex flex-col items-center justify-center h-50 border rounded-md p-4 bg-secondary/10">
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
                )}

                {/* Tags — gated on tag:read (select) and tag:create (add new) */}
                {canReadTag && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                      <TagIcon className="w-5 h-5 text-accent-foreground" />
                      Tags
                    </h3>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field: { ref: _ref, ...field } }) => (
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
                                    tags?.find((tag) => tag.id === item)
                                      ?.title || item
                                  }
                                  className="w-full"
                                >
                                  <MultiSelectorInput
                                    className="w-full bg-background px-2 rounded-md"
                                    placeholder="Select tags"
                                  />
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

                      {canCreateTag && (
                        <>
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
                          <div className="flex items-center gap-2 flex-wrap p-2">
                            {memoizedNewTags}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Expense Management */}
                <div>
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
              </div>
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-6">
            {/* Teams */}
            <Card className={isEdit ? undefined : 'bg-transparent border-none'}>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Users2 className="w-5 h-5" />
                  Teams
                </h3>

                <div className="space-y-3">
                  <Select
                    onValueChange={handleAddTeam}
                    value=""
                    disabled={availableTeams.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          availableTeams.length === 0
                            ? 'All teams added'
                            : 'Add a team...'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team) => (
                        <SelectItem key={`team-opt-${team.id}`} value={team.id}>
                          <div className="flex items-center gap-2">
                            <Users2 className="w-3.5 h-3.5 text-muted-foreground" />
                            {team.name}
                            <span className="text-xs text-muted-foreground">
                              ({team.memberCount}{' '}
                              {team.memberCount === 1 ? 'member' : 'members'})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {teamFields.length > 0 ? (
                    <div className="space-y-2">
                      {teamFields.map((field, index) => {
                        const team = allTeams.find((t) => t.id === field.teamId)
                        if (!team) return null
                        return (
                          <div
                            key={field.id}
                            className="flex items-center justify-between px-3 py-2 bg-accent rounded-md"
                          >
                            <div className="flex items-center gap-2 text-accent-foreground">
                              <Users2 className="w-4 h-4 shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  {team.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {team.memberCount}{' '}
                                  {team.memberCount === 1
                                    ? 'member'
                                    : 'members'}{' '}
                                  · team access
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeTeam(index)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No teams added. Team members are added automatically.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Individual Members */}
            <Card className={isEdit ? undefined : 'bg-transparent border-none'}>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5" />
                  Individual Members
                </h3>

                <div className="space-y-4">
                  <Select
                    onValueChange={handleAddMember}
                    value=""
                    disabled={availableMembers.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          availableMembers.length === 0
                            ? 'All members added'
                            : 'Add a member...'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map((member) => (
                        <SelectItem
                          key={`member-opt-${member.id}`}
                          value={member.id}
                        >
                          <div className="flex items-center gap-2">
                            <UserAvatar
                              avatarSize={20}
                              fontSize={9}
                              username={member.name}
                            />
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <ScrollArea className="h-72 border rounded-md p-2">
                    <div className="space-y-2">
                      {/* Creator row (create mode only) */}
                      {!isEdit && creatorMember && (
                        <div className="flex items-center justify-between p-2.5 bg-accent/60 rounded-md border border-border/50">
                          <div className="flex items-center gap-2.5 flex-1 text-accent-foreground">
                            <UserAvatar
                              avatarSize={32}
                              username={creatorMember.name}
                              fontSize={12}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {creatorMember.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {creatorMember.email}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                          >
                            Creator
                          </Badge>
                        </div>
                      )}

                      {/* Member list */}
                      {memberFields.map((field, index) => {
                        const member = orgMembers.find(
                          (m) => m.id === field.memberId,
                        )
                        if (!member) return null
                        // In create mode, skip showing the creator (shown separately above)
                        if (!isEdit && member.id === creatorMember?.id)
                          return null

                        return (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-2.5 bg-accent rounded-md"
                          >
                            <div className="flex items-center gap-2.5 flex-1 text-accent-foreground">
                              <UserAvatar
                                avatarSize={32}
                                username={member.name}
                                fontSize={12}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {member.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {member.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center gap-1.5 text-accent-foreground">
                                <Checkbox
                                  id={`manager-${field.id}`}
                                  checked={form.watch(
                                    `members.${index}.isManager`,
                                  )}
                                  onCheckedChange={() =>
                                    toggleMemberManager(index)
                                  }
                                />
                                <Label
                                  htmlFor={`manager-${field.id}`}
                                  className="text-xs cursor-pointer"
                                >
                                  Manager
                                </Label>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeMember(index)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}

                      {/* Empty state */}
                      {memberFields.filter(
                        (f) => !isEdit || f.memberId !== creatorMember?.id,
                      ).length === 0 &&
                        !creatorMember && (
                          <div className="flex flex-col items-center justify-center h-40">
                            <Users className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              No individual members added
                            </p>
                          </div>
                        )}
                    </div>
                  </ScrollArea>

                  {teamFields.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Members already covered by a team will be assigned via
                      team access. Individual entries for the same member are
                      ignored.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className={isEdit ? undefined : undefined}>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Text className="w-5 h-5 text-accent-foreground" />
                  Description
                </h3>

                <Textarea
                  className="min-h-50"
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

export default ProjectForm
