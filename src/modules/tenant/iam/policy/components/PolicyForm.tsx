// src/modules/tenant/iam/policy/components/PolicyForm.tsx
'use client'

import { AccessScope } from '@/prisma/generated/client'
import {
  CreatePolicySchema,
  type CreatePolicyRequest,
} from '@/server/modules/account/policies/features/create-policy/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import PageHeader from '@src/components/PageHeader'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import { cn } from '@src/lib/utils'
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
import { Textarea } from '@ui/textarea'
import { Building2, FileText, FolderKanban, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PermissionAccordion } from '../../components/PermissionAccordion'
import type { StatementDraft } from '../../types'

const toggleStatement = (
  current: StatementDraft[],
  action: string,
  resource: string,
): StatementDraft[] => {
  const fullAction = action === '*' ? `${resource}:*` : `${resource}:${action}`
  const fullResource = `${resource}/*`

  if (action === '*') {
    const hasWildcard = current.some(
      (s) => s.resource === fullResource && s.action === `${resource}:*`,
    )
    if (hasWildcard) {
      return current.filter((s) => s.resource !== fullResource)
    }
    return [
      ...current.filter((s) => s.resource !== fullResource),
      { effect: 'ALLOW' as const, action: fullAction, resource: fullResource },
    ]
  }

  const hasThis = current.some(
    (s) => s.resource === fullResource && s.action === fullAction,
  )
  if (hasThis) {
    return current.filter(
      (s) => !(s.resource === fullResource && s.action === fullAction),
    )
  }
  return [
    ...current,
    { effect: 'ALLOW' as const, action: fullAction, resource: fullResource },
  ]
}

export const PolicyForm = ({
  defaultPolicy,
  defaultScope = AccessScope.ORGANIZATION,
  onSubmit,
  onCancel,
  isPending,
}: {
  defaultPolicy?: PolicyResponse
  defaultScope?: AccessScope
  onSubmit: (data: CreatePolicyRequest) => void
  onCancel: () => void
  isPending?: boolean
}) => {
  const isEdit = !!defaultPolicy

  const form = useForm<CreatePolicyRequest>({
    resolver: zodResolver(CreatePolicySchema),
    defaultValues: {
      name: defaultPolicy?.name ?? '',
      description: defaultPolicy?.description ?? '',
      scope:
        (defaultPolicy?.scope as AccessScope | undefined) ??
        defaultScope ??
        AccessScope.ORGANIZATION,
      statements:
        defaultPolicy?.statements.map((s) => ({
          effect: s.effect as 'ALLOW' | 'DENY',
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
          effect: s.effect as 'ALLOW' | 'DENY',
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
    (action: string, resource: string) => {
      const current = form.getValues('statements') as StatementDraft[]
      form.setValue('statements', toggleStatement(current, action, resource), {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    [form],
  )

  const handleScopeChange = (newScope: AccessScope) => {
    form.setValue('scope', newScope, { shouldDirty: true })
    if (newScope === 'PROJECT') {
      const orgOnlyResources = ['organization', 'member', 'invitation', 'team']
      const current = form.getValues('statements') as StatementDraft[]
      const filtered = current.filter((s) => {
        const resource = s.resource.replace('/*', '')
        if (orgOnlyResources.includes(resource)) return false
        if (s.action === 'project:create') return false
        return true
      })
      form.setValue('statements', filtered, { shouldDirty: true })
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
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => handleScopeChange('ORGANIZATION')}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                          scope === 'ORGANIZATION'
                            ? 'border-signature-coral/40 bg-signature-coral/5 ring-1 ring-signature-coral/20'
                            : 'border-border hover:border-signature-coral/30 hover:bg-muted/40',
                        )}
                      >
                        <div
                          className={cn(
                            'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                            scope === 'ORGANIZATION'
                              ? 'bg-signature-coral text-white'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Organization</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Applies across all projects in the org
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleScopeChange('PROJECT')}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                          scope === 'PROJECT'
                            ? 'border-signature-forest/40 bg-signature-forest/5 ring-1 ring-signature-forest/20'
                            : 'border-border hover:border-signature-forest/30 hover:bg-muted/40',
                        )}
                      >
                        <div
                          className={cn(
                            'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                            scope === 'PROJECT'
                              ? 'bg-signature-forest text-white'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Project</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Applies to a specific project only
                          </p>
                        </div>
                      </button>
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
                {scope === 'PROJECT' && (
                  <span className="text-[10px] font-normal text-white/60 ml-1">
                    — project-scoped only
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <PermissionAccordion
                  statements={statements}
                  onToggle={handleToggle}
                  scope={scope}
                />
              </div>
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
