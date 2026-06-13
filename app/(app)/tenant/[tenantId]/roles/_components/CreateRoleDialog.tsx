// app/(app)/tenant/[tenantId]/roles/components/CreateRoleDialog.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@src/lib/utils'
import {
  AccessScope,
  type CreateRoleCommand,
  CreateRoleSchema,
} from '@src/modules/tenant/iam/roles/role.types'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog'
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
import { Briefcase, Building2, FolderKanban, Loader2, Plus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  defaultScope?: AccessScope
  onSubmit: (data: CreateRoleCommand) => void
}

export const CreateRoleDialog = ({ defaultScope, onSubmit }: Props) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateRoleCommand>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      scope: defaultScope ?? AccessScope.Organization,
    },
  })

  const scope = form.watch('scope')

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) form.reset()
  }

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      console.info('hre')
      onSubmit(data)
      form.reset()
      setOpen(false)
    })
  })

  const scopeOptions = [
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
      description: 'Applies to a specific project only',
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="tertiary" size="sm">
          <Plus className="w-4 h-4" />
          New Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Define a new access role. You can attach policies after creation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="scope"
              render={() => (
                <FormItem>
                  <FormLabel>Access Scope</FormLabel>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {scopeOptions.map(
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
                          onClick={() =>
                            form.setValue('scope', value, {
                              shouldDirty: true,
                            })
                          }
                          className={cn(
                            'flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all',
                            scope === value
                              ? activeClass
                              : `border-border ${hoverClass}`,
                          )}
                        >
                          <div
                            className={cn(
                              'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5',
                              scope === value
                                ? iconActiveClass
                                : 'bg-surface-soft border border-hairline text-body-text',
                            )}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-ink">{label}</p>
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
                  <FormLabel>Role name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. DEVELOPER, CLIENT, CONTRACTOR"
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
                      rows={3}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
