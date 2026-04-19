// app/(app)/organization/[organizationId]/(management)/teams/_components/CreateTeamDialog.tsx
'use client'
import { CreateTeamSchema } from '@/server/modules/account/teams/features/create-team/schema'
import type { CreateTeamRequest } from '@/server/modules/account/teams/features/create-team/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
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
import { useForm } from 'react-hook-form'

type CreateTeamDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTeamRequest) => void
  isPending: boolean
}

const CreateTeamDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: CreateTeamDialogProps) => {
  const form = useForm<CreateTeamRequest>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: { name: '' },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Design Team"
                      autoFocus
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Team'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTeamDialog
