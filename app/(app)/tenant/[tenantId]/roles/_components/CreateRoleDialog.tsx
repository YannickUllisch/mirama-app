// app/(app)/tenant/[tenantId]/roles/components/CreateRoleDialog.tsx
import type { CreateRoleRequest } from '@/server/modules/account/roles/features/create-role/schema'
import { CreateRoleSchema } from '@/server/modules/account/roles/features/create-role/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@src/lib/utils'
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
import { Building2, FolderKanban, Loader2, Plus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  onSubmit: (data: CreateRoleRequest) => void
}

export const CreateRoleDialog = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateRoleRequest>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: { name: '', description: '', scope: 'ORGANIZATION' },
  })

  const scope = form.watch('scope')

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) form.reset()
  }

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      onSubmit(data)
      form.reset()
      setOpen(false)
    })
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
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
            {/* Scope Selector */}
            <FormField
              control={form.control}
              name="scope"
              render={() => (
                <FormItem>
                  <FormLabel>Access Scope</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue('scope', 'ORGANIZATION', {
                          shouldDirty: true,
                        })
                      }
                      className={cn(
                        'flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all',
                        scope === 'ORGANIZATION'
                          ? 'border-mirama-blue bg-mirama-blue/5 ring-1 ring-mirama-blue/20'
                          : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20',
                      )}
                    >
                      <div
                        className={cn(
                          'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5',
                          scope === 'ORGANIZATION'
                            ? 'bg-mirama-blue/10 text-mirama-blue'
                            : 'bg-warm-white dark:bg-warm-dark text-warm-gray-300',
                        )}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold">Organization</p>
                        <p className="text-[12px] text-warm-gray-500 mt-0.5">
                          Applies across all projects
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue('scope', 'PROJECT', {
                          shouldDirty: true,
                        })
                      }
                      className={cn(
                        'flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all',
                        scope === 'PROJECT'
                          ? 'border-mirama-blue bg-mirama-blue/5 ring-1 ring-mirama-blue/20'
                          : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20',
                      )}
                    >
                      <div
                        className={cn(
                          'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5',
                          scope === 'PROJECT'
                            ? 'bg-mirama-blue/10 text-mirama-blue'
                            : 'bg-warm-white dark:bg-warm-dark text-warm-gray-300',
                        )}
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold">Project</p>
                        <p className="text-[12px] text-warm-gray-500 mt-0.5">
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
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
