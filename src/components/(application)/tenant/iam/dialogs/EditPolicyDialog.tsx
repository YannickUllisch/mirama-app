import type { UpdatePolicyRequest } from '@/server/modules/account/policies/features/update-policy/schema'
import { UpdatePolicySchema } from '@/server/modules/account/policies/features/update-policy/schema'
import type { PolicyResponse } from '@/server/modules/account/roles/features/response'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from 'lucide-react'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { PermissionAccordion } from '../PermissionAccordion'
import type { StatementDraft } from '../types'

type Props = {
  policy: PolicyResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: string, data: UpdatePolicyRequest) => void
}

function toggleStatement(
  current: StatementDraft[],
  action: string,
  resource: string,
): StatementDraft[] {
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

export const EditPolicyDialog = ({
  policy,
  open,
  onOpenChange,
  onSubmit,
}: Props) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<UpdatePolicyRequest>({
    resolver: zodResolver(UpdatePolicySchema),
    defaultValues: { name: '', description: '', statements: [] },
  })

  // Re-seed form whenever the selected policy changes
  useEffect(() => {
    if (policy) {
      form.reset({
        name: policy.name,
        description: policy.description ?? '',
        statements: policy.statements.map((s) => ({
          effect: s.effect as 'ALLOW' | 'DENY',
          action: s.action,
          resource: s.resource,
        })),
      })
    }
  }, [policy, form])

  const statements = (form.watch('statements') ?? []) as StatementDraft[]

  const handleToggle = (action: string, resource: string) => {
    form.setValue('statements', toggleStatement(statements, action, resource), {
      shouldValidate: true,
    })
  }

  const handleSubmit = form.handleSubmit((data) => {
    if (!policy) return
    startTransition(() => {
      onSubmit(policy.id, data)
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Policy</DialogTitle>
          <DialogDescription>
            Update the name, description, and permission statements for this
            policy.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
            <div className="space-y-1.5">
              <p className="text-sm font-medium leading-none">Permissions</p>
              <div className="border border-border rounded-xl overflow-hidden">
                <PermissionAccordion
                  statements={statements}
                  onToggle={handleToggle}
                />
              </div>
              {form.formState.errors.statements && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {(form.formState.errors.statements as { message?: string })
                    .message ?? 'At least one permission is required'}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !policy}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
