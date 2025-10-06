'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import { CreateTagSchema, type CreateTagType } from '@server/domain/tagSchema'
import { Button } from '@src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import { Input } from '@src/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Plus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

const AddTagDialog = () => {
  // States
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Form States
  const form = useForm<CreateTagType>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: {
      title: '',
    },
  })

  // Hooks
  const { mutate: useCreateTag, isPending: isCreatePending } =
    apiRequest.tag.create.useMutation()

  // Helper functions
  const onSubmit = (vals: CreateTagType) => {
    startTransition(() => {
      useCreateTag(vals, {
        onSuccess: () => {
          handleClose()
        },
      })
    })
  }

  const handleClose = () => {
    form.reset()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'}>
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
          <DialogDescription>
            Tags can be applied to both Projects and Tasks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={isPending || isCreatePending}
                  variant="link"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || isCreatePending}
                variant="default"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTagDialog
