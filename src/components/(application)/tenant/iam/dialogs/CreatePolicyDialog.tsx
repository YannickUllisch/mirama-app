import {
  CreatePolicySchema,
  type CreatePolicyRequest,
} from '@/server/modules/account/policies/features/create-policy/schema'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Loader2, Plus } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { PermissionAccordion } from '../PermissionAccordion'

type Props = {
  onSubmit: (data: CreatePolicyRequest) => void
}

// Fixed toggle logic to ensure it returns the correct shape
function toggleStatement(
  current: CreatePolicyRequest['statements'],
  action: string,
  resource: string,
): CreatePolicyRequest['statements'] {
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
      { effect: 'ALLOW', action: fullAction, resource: fullResource },
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
    { effect: 'ALLOW', action: fullAction, resource: fullResource },
  ]
}

export const CreatePolicyDialog = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreatePolicyRequest>({
    resolver: zodResolver(CreatePolicySchema),
    defaultValues: {
      name: '',
      description: '',
      statements: [],
    },
  })

  // Watch specifically the statements field
  const statements = form.watch('statements')

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // Reset after a tiny delay to allow the dialog closing animation
      // to finish without triggering a state update mid-render
      setTimeout(() => form.reset(), 150)
    }
  }

  const handleToggle = useCallback(
    (action: string, resource: string) => {
      const currentStatements = form.getValues('statements')
      const nextStatements = toggleStatement(
        currentStatements,
        action,
        resource,
      )

      form.setValue('statements', nextStatements, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    [form],
  )

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      onSubmit(data)
      setOpen(false)
    })
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Policy</DialogTitle>
          <DialogDescription>
            Define organization-wide permissions.
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
                    <Input placeholder="e.g. ProjectFullAccess" {...field} />
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
                      placeholder="Optional description..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1.5">
              <p className="text-sm font-medium">Permissions</p>
              <div className="border border-border rounded-xl overflow-hidden">
                <PermissionAccordion
                  statements={statements}
                  onToggle={handleToggle}
                />
              </div>
              {form.formState.errors.statements && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.statements.message}
                </p>
              )}
            </div>

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
                Create Policy
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
