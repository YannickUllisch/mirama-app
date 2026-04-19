// app/(app)/organization/[organizationId]/(management)/teams/_components/AddTeamMemberDialog.tsx
'use client'
import type { MemberResponse } from '@/server/modules/account/members/features/response'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const AddMemberSchema = z.object({
  memberId: z.string().min(1, 'Please select a member'),
})

type AddMemberFormData = z.infer<typeof AddMemberSchema>

type AddTeamMemberDialogProps = {
  isOpen: boolean
  onClose: () => void
  availableMembers: MemberResponse[]
  onAdd: (memberId: string) => void
  isPending: boolean
}

const AddTeamMemberDialog = ({
  isOpen,
  onClose,
  availableMembers,
  onAdd,
  isPending,
}: AddTeamMemberDialogProps) => {
  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(AddMemberSchema),
    defaultValues: { memberId: '' },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onAdd(data.memberId)
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      onClose()
    }
  }

  const noMembersLeft = availableMembers.length === 0

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member to Team</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={noMembersLeft}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            noMembersLeft
                              ? 'All members are already in this team'
                              : 'Select a member...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex flex-col py-0.5">
                              <span className="font-medium">{m.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {m.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <Button type="submit" disabled={isPending || noMembersLeft}>
                {isPending ? 'Adding...' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTeamMemberDialog
