// src/modules/tenant/iam/policy/components/PolicyForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import PageHeader from '@src/components/PageHeader'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import { cn } from '@src/lib/utils'
import { PermissionAccordion } from '@src/modules/tenant/iam/components/PermissionAccordion'
import iamHooks from '@src/modules/tenant/iam/hooks/hooks'
import type {
  CreatePolicyCommand,
  PolicyResponse,
} from '@src/modules/tenant/iam/policy/policyTypes'
import { CreatePolicySchema } from '@src/modules/tenant/iam/policy/policyTypes'
import { AccessScope } from '@src/modules/tenant/iam/roles/roleTypes'
import type { StatementDraft } from '@src/modules/tenant/iam/types'
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
  FileText,
  FolderKanban,
  ShieldCheck,
} from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const toggleStatement = (
  current: StatementDraft[],
  action: string,
  resourcePattern: string,
): StatementDraft[] => {
  const isWildcard = action.endsWith(':*')

  if (isWildcard) {
    const hasWildcard = current.some(
      (s) => s.resource === resourcePattern && s.action === action,
    )
    if (hasWildcard)
      return current.filter((s) => s.resource !== resourcePattern)
    return [
      ...current.filter((s) => s.resource !== resourcePattern),
      { effect: 'Allow' as const, action, resource: resourcePattern },
    ]
  }

  const hasThis = current.some(
    (s) => s.resource === resourcePattern && s.action === action,
  )
  if (hasThis)
    return current.filter(
      (s) => !(s.resource === resourcePattern && s.action === action),
    )
  return [
    ...current,
    { effect: 'Allow' as const, action, resource: resourcePattern },
  ]
}

const SCOPE_OPTIONS = [
  {
    value: AccessScope.Organization,
    label: 'Organization',
    description: 'Applies across all projects in the org',
    icon: Building2,
    activeClass:
      'border-signature-coral/40 bg-signature-coral/5 ring-1 ring-signature-coral/20',
    hoverClass: 'hover:border-signature-coral/30 hover:bg-muted/40',
    iconActiveClass: 'bg-signature-coral text-white',
  },
  {
    value: AccessScope.Project,
    label: 'Project',
    description: 'Applies to a specific project only',
    icon: FolderKanban,
    activeClass:
      'border-signature-forest/40 bg-signature-forest/5 ring-1 ring-signature-forest/20',
    hoverClass: 'hover:border-signature-forest/30 hover:bg-muted/40',
    iconActiveClass: 'bg-signature-forest text-white',
  },
  {
    value: AccessScope.Client,
    label: 'Client',
    description: 'Applies to client-facing access',
    icon: Briefcase,
    activeClass:
      'border-signature-mustard/40 bg-signature-mustard/5 ring-1 ring-signature-mustard/20',
    hoverClass: 'hover:border-signature-mustard/30 hover:bg-muted/40',
    iconActiveClass: 'bg-signature-mustard text-white',
  },
] as const

export const PolicyForm = ({
  defaultPolicy,
  defaultScope = AccessScope.Organization,
  onSubmit,
  onCancel,
  isPending,
}: {
  defaultPolicy?: PolicyResponse
  defaultScope?: AccessScope
  onSubmit: (data: CreatePolicyCommand) => void
  onCancel: () => void
  isPending?: boolean
}) => {
  const isEdit = !!defaultPolicy
  const { data: availablePermissions, isLoading: permissionsLoading } =
    iamHooks.availablePermissions.useQuery()

  const form = useForm<CreatePolicyCommand>({
    resolver: zodResolver(CreatePolicySchema),
    defaultValues: {
      name: defaultPolicy?.name ?? '',
      description: defaultPolicy?.description ?? '',
      scope:
        (defaultPolicy?.scope as AccessScope | undefined) ??
        defaultScope ??
        AccessScope.Organization,
      statements:
        defaultPolicy?.statements.map((s) => ({
          effect: s.effect,
          action: s.action,
          resource: s.resource,
        })) ?? [],
    },
  })

  useEffect(() => {
    if (defaultPolicy) {
      form.reset({
        name: defaultPolicy.name,
        description: defaultPolicy.description ?? '',
        scope: defaultPolicy.scope as AccessScope,
        statements: defaultPolicy.statements.map((s) => ({
          effect: s.effect,
          action: s.action,
          resource: s.resource,
        })),
      })
    }
  }, [defaultPolicy, form])

  const scope = form.watch('scope') as AccessScope
  const statements = (form.watch('statements') ?? []) as StatementDraft[]
  const isDirty = !isEdit || form.formState.isDirty

  const handleToggle = useCallback(
    (action: string, resourcePattern: string) => {
      const current = form.getValues('statements') as StatementDraft[]
      form.setValue(
        'statements',
        toggleStatement(current, action, resourcePattern),
        { shouldValidate: true, shouldDirty: true },
      )
    },
    [form],
  )

  const handleScopeChange = (newScope: AccessScope) => {
    form.setValue('scope', newScope, { shouldDirty: true })
    if (availablePermissions?.groups) {
      const allowedPatterns = new Set(
        availablePermissions.groups
          .filter((g) => g.scope === newScope)
          .map((g) => g.resourcePattern),
      )
      const current = form.getValues('statements') as StatementDraft[]
      form.setValue(
        'statements',
        current.filter((s) => allowedPatterns.has(s.resource)),
        { shouldDirty: true },
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader
          title={isEdit ? `Edit — ${defaultPolicy.name}` : 'Create Policy'}
          icon={FileText}
          description="Define permissions to attach to roles"
        />

        <div className="space-y-4 pb-6 px-4 pt-5">
          {/* Policy Details */}
          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 bg-signature-coral">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                <FileText className="w-4 h-4 text-white/70" />
                Policy Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {/* Scope selector */}
              <FormField
                control={form.control}
                name="scope"
                render={() => (
                  <FormItem>
                    <FormLabel>Access Scope</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Organization policies grant access across the whole org.
                      Project policies are assigned per-project.
                    </p>
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
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                              scope === value
                                ? activeClass
                                : `border-border ${hoverClass}`,
                            )}
                          >
                            <div
                              className={cn(
                                'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                                scope === value
                                  ? iconActiveClass
                                  : 'bg-muted text-muted-foreground',
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{label}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {description}
                              </p>
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. ProjectFullAccess, ReadOnly"
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
                        placeholder="Describe what this policy grants..."
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

          {/* Permissions */}
          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 bg-signature-forest">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-white/70" />
                Permissions
                {scope !== AccessScope.Organization && (
                  <span className="text-[10px] font-normal text-white/60 ml-1">
                    — {scope.toLowerCase()}-scoped only
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {permissionsLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <PermissionAccordion
                    groups={availablePermissions?.groups ?? []}
                    statements={statements}
                    onToggle={handleToggle}
                    scope={scope}
                  />
                </div>
              )}
              {form.formState.errors.statements && (
                <p className="text-[0.8rem] font-medium text-destructive px-4 py-2">
                  {(form.formState.errors.statements as { message?: string })
                    .message ?? 'At least one permission is required'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <SaveChangesOverlay
          isDirty={isDirty}
          isPending={isPending ?? false}
          onSubmit={form.handleSubmit(onSubmit)}
          onCancel={onCancel}
          submitLabel={isEdit ? 'Save Changes' : 'Create Policy'}
        />
      </form>
    </Form>
  )
}
