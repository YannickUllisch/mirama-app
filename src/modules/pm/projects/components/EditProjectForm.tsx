'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
import { ConfirmationDialog } from '@src/components/Dialogs/ConfirmationDialog'
import PageHeader from '@src/components/PageHeader'
import CalendarSelect from '@src/components/Select/CalendarSelect'
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
import { Textarea } from '@src/components/ui/textarea'
import { usePermissions } from '@src/modules/tenant/iam/PermissionContext'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import Centering from '@ui/centering'
import { ColorPicker } from '@ui/color-picker'
import {
  Archive,
  Calendar,
  ClipboardPen,
  Loader2,
  MessageCircleWarning,
  Milestone,
  PenIcon,
  Plus,
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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, type Resolver, useForm } from 'react-hook-form'
import type { z } from 'zod'
import type { UpdateProjectCommand } from '../projects.types'
import { UpdateProjectCommandSchema } from '../projects.types'

type EditFormValues = z.infer<typeof UpdateProjectCommandSchema>

interface EditProjectFormProps {
  projectId: string
}

const EditProjectForm = ({ projectId }: EditProjectFormProps) => {
  const router = useRouter()

  const { can } = usePermissions()

  const canUpdate = can('project', 'update')
  const canCreateMilestone = can('milestone', 'create')
  const canReadTag = can('tag', 'read')

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: new Date(),
    color: '',
  })
  const [pendingMemberId, setPendingMemberId] = useState('')
  const [pendingRoleId, setPendingRoleId] = useState('')

  const { data: project, isLoading: isProjectLoading } =
    apiRequest.project.fetchById.useQuery(projectId)
  const { items: orgMembers } = apiRequest.members.fetchAll.useQuery()
  const { items: allTags } = apiRequest.tags.fetchAll.useQuery()
  const { items: allTeams } = apiRequest.team.fetchAll.useQuery()
  const { data: projectRoles = [] } =
    apiRequest.role.fetchAllByScopeForOrganization.useQuery(AccessScope.Project)

  const { mutate: updateProject, isPending: isUpdating } =
    apiRequest.project.update.useMutation()
  const { mutate: archiveProject, isPending: isArchivePending } =
    apiRequest.project.archive.useMutation()
  const { mutate: addMemberMutation } =
    apiRequest.projectMembers.add.useMutation()
  const { mutate: removeMemberMutation } =
    apiRequest.projectMembers.remove.useMutation()
  const { mutate: addTeamMutation } = apiRequest.projectTeams.add.useMutation()
  const { mutate: removeTeamMutation } =
    apiRequest.projectTeams.remove.useMutation()
  const { mutate: createMilestoneMutation } =
    apiRequest.projectMilestones.create.useMutation()
  const { mutate: deleteMilestoneMutation } =
    apiRequest.projectMilestones.delete.useMutation()

  const form = useForm<EditFormValues>({
    resolver: zodResolver(
      UpdateProjectCommandSchema,
    ) as Resolver<EditFormValues>,
    defaultValues: {
      name: '',
      description: null,
      startDate: new Date().toISOString(),
      endDate: null,
      statusId: '',
      priorityId: '',
      budget: 0,
      tagIds: [],
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: project identity is sufficient
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description ?? null,
        startDate: project.startDate,
        endDate: project.endDate ?? null,
        statusId: project.statusId,
        priorityId: project.priorityId,
        budget: project.budget,
        tagIds: project.tagIds,
      })
    }
  }, [project])

  const handleAddMilestone = () => {
    if (!newMilestone.title) return
    createMilestoneMutation({
      projectId,
      data: {
        title: newMilestone.title,
        dueDate: newMilestone.dueDate.toISOString(),
        color: newMilestone.color || null,
      },
    })
    setNewMilestone({ title: '', dueDate: new Date(), color: '' })
  }

  const handleAddMember = () => {
    if (!pendingMemberId || !pendingRoleId) return
    addMemberMutation({
      projectId,
      data: { memberId: pendingMemberId, roleId: pendingRoleId },
    })
    setPendingMemberId('')
    setPendingRoleId('')
  }

  const onSubmit = (values: UpdateProjectCommand) => {
    updateProject(
      { id: projectId, data: values },
      { onSuccess: () => form.reset(values) },
    )
  }

  if (!canUpdate) {
    return (
      <div className="flex flex-col items-center justify-center h-100 gap-4 text-muted-foreground">
        <ShieldOff className="w-12 h-12" />
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-sm">
          You do not have permission to edit projects in this organization.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (isProjectLoading) {
    return (
      <div className="flex items-center justify-center h-100">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const currentMembers = project?.members.filter((m) => !m.isInherited) ?? []
  const currentTeamIds = project?.teamIds ?? []
  const currentMilestones = project?.milestones ?? []

  const availableMembers = orgMembers.filter(
    (m) => !currentMembers.some((pm) => pm.memberId === m.id),
  )
  const availableTeams = allTeams.filter((t) => !currentTeamIds.includes(t.id))

  const isAnyPending = isUpdating || isArchivePending

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-12.5"
      >
        {/* Header */}
        <PageHeader
          title="Update Project"
          description="View and manage your project"
          icon={PenIcon}
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
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Project</span>
            </Button>
          </div>
        </PageHeader>

        {/* Title card */}
        <Card>
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

                <Centering>
                  <ConfirmationDialog
                    title="Archive project?"
                    description="Are you sure you want to archive this project?"
                    onCancel={() => null}
                    onSubmit={() => archiveProject(projectId)}
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={isArchivePending}
                    >
                      <Archive className="w-4 h-4" />
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

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <Card className="col-span-1 lg:col-span-2">
            <CardContent>
              <div className="space-y-6">
                {/* Timeline & Settings */}
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-accent-foreground" />
                    Timeline &amp; Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <CalendarSelect
                            onChange={(date) =>
                              field.onChange(
                                date ? date.toISOString() : field.value,
                              )
                            }
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
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
                            onChange={(date) =>
                              field.onChange(date ? date.toISOString() : null)
                            }
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priorityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. 018e1234-..."
                              className="font-mono text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="statusId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. 018e1234-..."
                              className="font-mono text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Milestones (direct mutations, outside form schema) */}
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
                                  dueDate: date ?? new Date(),
                                }))
                              }
                              value={newMilestone.dueDate}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col md:ml-10">
                          <Label>Color</Label>
                          <div className="mt-1">
                            <ColorPicker
                              onValueChange={(color) =>
                                setNewMilestone((s) => ({ ...s, color }))
                              }
                              value={newMilestone.color}
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

                      {currentMilestones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-50 border rounded-md p-4 bg-secondary/10">
                          <Milestone className="w-12 h-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No milestones added yet
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Add key project milestones to track progress
                          </p>
                        </div>
                      ) : (
                        <ScrollArea className="h-50 border rounded-md p-4">
                          <div className="space-y-3">
                            {currentMilestones.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between p-3 bg-accent text-accent-foreground rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-accent p-2 rounded-full">
                                    <Milestone className="w-4 h-4 text-accent-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{m.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Due:{' '}
                                      {new Date(m.dueDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() =>
                                    deleteMilestoneMutation({
                                      projectId,
                                      milestoneId: m.id,
                                    })
                                  }
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags (part of UpdateProjectCommand) */}
                {canReadTag && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                      <TagIcon className="w-5 h-5 text-accent-foreground" />
                      Tags
                    </h3>

                    <FormField
                      control={form.control}
                      name="tagIds"
                      render={({ field: { ref: _ref, ...field } }) => (
                        <FormItem>
                          <FormLabel>Select Tags</FormLabel>
                          <MultiSelector
                            {...form.register('tagIds')}
                            values={field.value ?? []}
                            onValuesChange={field.onChange}
                            loop
                            onBlur={field.onBlur}
                          >
                            <FormControl>
                              <MultiSelectorTrigger
                                renderValue={(item) =>
                                  allTags.find((tag) => tag.id === item)
                                    ?.name || item
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
                                {allTags.map((tag) => (
                                  <MultiSelectorItem
                                    value={tag.id}
                                    key={`tag-${tag.id}`}
                                  >
                                    {tag.name}
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
                )}

                {/* Budget */}
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
                                  ? 0
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
            {/* Teams (direct mutations) */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Users2 className="w-5 h-5" />
                  Teams
                </h3>

                <div className="space-y-3">
                  <Select
                    onValueChange={(teamId) =>
                      addTeamMutation({ projectId, teamId })
                    }
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
                              ({team.memberIds.length}{' '}
                              {team.memberIds.length === 1
                                ? 'member'
                                : 'members'}
                              )
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentTeamIds.length > 0 ? (
                    <div className="space-y-2">
                      {currentTeamIds.map((teamId) => {
                        const team = allTeams.find((t) => t.id === teamId)
                        if (!team) return null
                        return (
                          <div
                            key={teamId}
                            className="flex items-center justify-between px-3 py-2 bg-accent rounded-md"
                          >
                            <div className="flex items-center gap-2 text-accent-foreground">
                              <Users2 className="w-4 h-4 shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  {team.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {team.memberIds.length}{' '}
                                  {team.memberIds.length === 1
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
                              onClick={() =>
                                removeTeamMutation({ projectId, teamId })
                              }
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

            {/* Individual Members (direct mutations) */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5" />
                  Individual Members
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Select
                      onValueChange={setPendingMemberId}
                      value={pendingMemberId}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select member..." />
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

                    <Select
                      onValueChange={setPendingRoleId}
                      value={pendingRoleId}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projectRoles.map((role) => (
                          <SelectItem
                            key={`role-opt-${role.id}`}
                            value={role.id}
                          >
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      onClick={handleAddMember}
                      disabled={!pendingMemberId || !pendingRoleId}
                      size="icon"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-72 border rounded-md p-2">
                    <div className="space-y-2">
                      {currentMembers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40">
                          <Users className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No individual members added
                          </p>
                        </div>
                      ) : (
                        currentMembers.map((pm) => {
                          const member = orgMembers.find(
                            (m) => m.id === pm.memberId,
                          )
                          if (!member) return null
                          const role = projectRoles.find(
                            (r) => r.id === pm.roleId,
                          )
                          return (
                            <div
                              key={pm.id}
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
                                    {role?.name ?? member.email}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  removeMemberMutation({
                                    projectId,
                                    memberId: pm.memberId,
                                  })
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </ScrollArea>

                  {currentTeamIds.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Members already covered by a team will be assigned via
                      team access.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Text className="w-5 h-5 text-accent-foreground" />
                  Description
                </h3>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-50"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          placeholder="Describe the project goals, scope, and other important details..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default EditProjectForm
