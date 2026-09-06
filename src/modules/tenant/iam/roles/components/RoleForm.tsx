// src/modules/tenant/iam/roles/components/RoleForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import PageHeader from '@src/components/PageHeader'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import { cn } from '@src/lib/utils'
import ReturnLink from '@src/modules/shared/components/ReturnLink'
import policyHooks from '@src/modules/tenant/iam/policy/policy.hooks'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import roleHooks from '@src/modules/tenant/iam/roles/role.hooks'
import {
  AccessScope,
  type CreateRoleCommand,
  CreateRoleSchema,
  type RoleResponse,
} from '@src/modules/tenant/iam/roles/role.types'
import { SCOPE_VISUALS } from '@src/modules/tenant/iam/scopeConfig'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { Skeleton } from '@ui/skeleton'
import { Textarea } from '@ui/textarea'
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  Link2,
  Lock,
  Shield,
  ShieldCheck,
  Unlink,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

const SCOPE_OPTIONS = [
  {
    value: AccessScope.Organization,
    label: 'Organization',
    description: 'Applies across all projects',
    icon: Building2,
    activeClass: 'border-lava/30 bg-lava/5 ring-1 ring-lava/20',
    hoverClass: 'hover:border-lava/20 hover:bg-surface-soft',
    iconActiveClass: 'bg-lava text-white',
  },
  {
    value: AccessScope.Project,
    label: 'Project',
    description: 'Applies to a specific project',
    icon: FolderKanban,
    activeClass: 'border-mirama/30 bg-mirama/5 ring-1 ring-mirama/20',
    hoverClass: 'hover:border-mirama/20 hover:bg-surface-soft',
    iconActiveClass: 'bg-mirama text-white',
  },
  {
    value: AccessScope.Client,
    label: 'Client',
    description: 'Applies to client-facing access',
    icon: Briefcase,
    activeClass: 'border-warning/30 bg-warning/5 ring-1 ring-warning/20',
    hoverClass: 'hover:border-warning/20 hover:bg-surface-soft',
    iconActiveClass: 'bg-warning text-ink',
  },
] as const

export const RoleForm = ({
  defaultRole,
  defaultScope = AccessScope.Organization,
}: {
  defaultRole?: RoleResponse
  defaultScope?: AccessScope
}) => {
  const isEdit = !!defaultRole
  const router = useRouter()
  const { activeOrganizationSlug } = useOrganizationResource()
  const [isPending, startTransition] = useTransition()

  const { mutate: createRole } = roleHooks.create.useMutation()
  const { mutate: updateRole } = roleHooks.update.useMutation()

  const rolesHref = `/organization/${activeOrganizationSlug}/settings/roles`

  const form = useForm<CreateRoleCommand>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: defaultRole?.name ?? '',
      description: defaultRole?.description ?? '',
      scope: (defaultRole?.scope as AccessScope) ?? defaultScope,
    },
  })

  const scope = form.watch('scope') as AccessScope
  const isDirty = !isEdit || form.formState.isDirty

  const handleScopeChange = (newScope: AccessScope) => {
    if (isEdit) return
    form.setValue('scope', newScope, { shouldDirty: true })
  }

  const handleSubmit = (data: CreateRoleCommand) => {
    if (isEdit) {
      startTransition(() => {
        updateRole(
          {
            id: defaultRole.id,
            data: {
              id: defaultRole.id,
              name: data.name,
              description: data.description,
            },
          },
          { onSuccess: () => router.push(rolesHref) },
        )
      })
    } else {
      startTransition(() => {
        createRole(data, { onSuccess: () => router.push(rolesHref) })
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <PageHeader
          title={isEdit ? `Edit - ${defaultRole.name}` : 'Create Role'}
          icon={Shield}
          description="Define a role and attach policies to control access"
        />

        <div className="space-y-4 pb-20 px-6 md:px-10 pt-6">
          <ReturnLink href={rolesHref} text="Back to policies" />

          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 bg-surface-dark">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                <Shield className="w-4 h-4 text-white/70" />
                Role Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <FormField
                control={form.control}
                name="scope"
                render={() => (
                  <FormItem>
                    <FormLabel>Access Scope</FormLabel>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {SCOPE_OPTIONS.map(
                        ({
                          value,
                          label,
                          description,
                          icon: Icon,
                          activeClass,
                          hoverClass,
                          iconActiveClass,
                        }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleScopeChange(value)}
                            disabled={isEdit}
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                              isEdit
                                ? scope === value
                                  ? cn(activeClass, 'cursor-default')
                                  : 'border-border opacity-40 cursor-not-allowed'
                                : scope === value
                                  ? activeClass
                                  : `border-border ${hoverClass}`,
                            )}
                          >
                            <div
                              className={cn(
                                'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                                scope === value
                                  ? iconActiveClass
                                  : 'bg-surface-soft border border-hairline text-body-text',
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ink">
                                {label}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {description}
                              </p>
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                    {isEdit && (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Lock className="w-3 h-3 shrink-0" />
                        Scope cannot be changed after creation.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. DEVELOPER, CONTRACTOR, REVIEWER"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe what this role can do..."
                        rows={2}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {isEdit && (
            <RolePolicySection
              roleId={defaultRole.id}
              scope={defaultRole.scope as AccessScope}
              isSystemRole={defaultRole.isSystemRole}
            />
          )}
        </div>

        <SaveChangesOverlay
          isDirty={isDirty}
          isPending={isPending}
          onSubmit={form.handleSubmit(handleSubmit)}
          onCancel={() => router.push(rolesHref)}
          submitLabel={isEdit ? 'Save Changes' : 'Create Role'}
        />
      </form>
    </Form>
  )
}

const RolePolicySection = ({
  roleId,
  scope,
  isSystemRole: initialIsSystemRole,
}: {
  roleId: string
  scope: AccessScope
  isSystemRole: boolean
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { data: currentRole } = roleHooks.fetchByIdForTenant.useQuery(roleId)
  const policyIds = currentRole?.policyIds ?? []
  const isSystemRole = currentRole?.isSystemRole ?? initialIsSystemRole

  const { data: allPolicies = [], isLoading } =
    policyHooks.fetchAllForScope.useQuery(scope)
  const { mutate: attach, isPending: attaching } =
    roleHooks.attachPolicy.useMutation()
  const { mutate: detach, isPending: detaching } =
    roleHooks.detachPolicy.useMutation()

  const attachedSet = new Set(policyIds)
  const attached = allPolicies.filter((p) => attachedSet.has(p.id))
  const available = allPolicies.filter((p) => !attachedSet.has(p.id))
  const isBusy = attaching || detaching

  const { label } = SCOPE_VISUALS[scope]

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 bg-surface-dark">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
          <ShieldCheck className="w-4 h-4 text-white/70" />
          Policies
          <span className="ml-auto text-[10px] font-normal text-white/50">
            {attached.length} attached
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {attached.length > 0 && (
              <div className="p-4 space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Attached ({attached.length})
                </p>
                {attached.map((policy) => (
                  <PolicyRow
                    key={policy.id}
                    policy={policy}
                    action="detach"
                    isExpanded={expanded.has(policy.id)}
                    disabled={isSystemRole || isBusy}
                    onToggle={() => toggleExpand(policy.id)}
                    onAction={() => detach({ roleId, policyId: policy.id })}
                  />
                ))}
              </div>
            )}

            <div className="p-4 space-y-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Available ({available.length})
              </p>
              {available.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 py-1 px-1">
                  All {label.toLowerCase()} policies attached.
                </p>
              ) : (
                <div className="space-y-1">
                  {available.map((policy) => (
                    <PolicyRow
                      key={policy.id}
                      policy={policy}
                      action="attach"
                      isExpanded={expanded.has(policy.id)}
                      disabled={isSystemRole || isBusy}
                      onToggle={() => toggleExpand(policy.id)}
                      onAction={() => attach({ roleId, policyId: policy.id })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isSystemRole && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground px-4 py-3 border-t border-border">
            <Lock className="w-3 h-3 shrink-0" />
            System roles cannot be modified.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

const PolicyRow = ({
  policy,
  action,
  isExpanded,
  disabled,
  onToggle,
  onAction,
}: {
  policy: PolicyResponse
  action: 'attach' | 'detach'
  isExpanded: boolean
  disabled: boolean
  onToggle: () => void
  onAction: () => void
}) => (
  <div className="rounded-lg border border-hairline overflow-hidden">
    <div className="flex items-center gap-2 px-3 py-2 bg-card hover:bg-surface-soft/60 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 min-w-0 flex-1 text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
        <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs font-mono font-medium truncate">
          {policy.name}
        </span>
        {policy.isSystemPolicy && (
          <Badge variant="secondary" className="text-[9px] px-1 h-3.5 shrink-0">
            system
          </Badge>
        )}
        {policy.statements.length > 0 && (
          <span className="text-[10px] text-muted-foreground ml-auto mr-2 shrink-0">
            {policy.statements.length} stmt
          </span>
        )}
      </button>
      <Button
        type="button"
        variant={action === 'detach' ? 'ghost' : 'secondary'}
        size="sm"
        className="h-6 px-2 text-[11px] shrink-0"
        disabled={disabled}
        onClick={onAction}
      >
        {action === 'detach' ? (
          <Unlink className="w-3 h-3 mr-1" />
        ) : (
          <Link2 className="w-3 h-3 mr-1" />
        )}
        {action === 'detach' ? 'Detach' : 'Attach'}
      </Button>
    </div>

    {isExpanded && (
      <div className="border-t border-hairline bg-surface-soft/40 px-3 py-2.5">
        {policy.statements.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            No statements defined.
          </p>
        ) : (
          <div className="space-y-1.5">
            {policy.statements.map((stmt) => (
              <div
                key={stmt.id}
                className="flex items-center gap-2 text-[11px] font-mono"
              >
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0',
                    stmt.effect === 'Allow'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400',
                  )}
                >
                  {stmt.effect}
                </span>
                <span className="text-foreground">{stmt.action}</span>
                <span className="text-muted-foreground/50">→</span>
                <span className="text-muted-foreground">{stmt.resource}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)
