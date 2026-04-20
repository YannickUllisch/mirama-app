'use client'
import type { Milestone } from '@/prisma/generated/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { MilestoneSchema } from '@server/modules/project/milestone/milestoneSchema'
import { Button } from '@src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import { Input } from '@src/components/ui/input'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type React from 'react'
import { useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Calendar } from '../ui/calendar'
import { ColorPicker } from '../ui/color-picker'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const AddMilestoneDialog = ({
  children,
  isOpen,
  setIsOpen,
  projectId,
  defaultMilestone,
}: {
  children?: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  projectId: string
  defaultMilestone?: Milestone
}) => {
  const [datePopup, setDatePopup] = useState(false)
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof MilestoneSchema>>({
    resolver: zodResolver(MilestoneSchema),
    values: {
      id: defaultMilestone?.id ?? '',
      title: defaultMilestone?.title ?? '',
      colors: defaultMilestone?.colors ?? '#FFFFFF',
      date: defaultMilestone?.date ?? new Date(),
      projectId: projectId,
    },
  })

  const onSubmit = (_vals: z.infer<typeof MilestoneSchema>) => {
    startTransition(() => {
      // if (vals.id === '') {
      //   // If id is empty we need to create new milestone, else update it
      //   postResource('project/milestones', vals)
      //     .then(() => {
      //       form.reset()
      //       setIsOpen(false)
      //     })
      //     .catch(() => {
      //       setIsOpen(false)
      //     })
      // } else {
      //   updateResourceById('project/milestones', vals.id, vals, {})
      //     .then(() => {
      //       form.reset()
      //       setIsOpen(false)
      //     })
      //     .catch(() => {
      //       setIsOpen(false)
      //     })
      // }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Configure Milestone</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-10 space-y-3 mx-[2%]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>Title</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Milestone Title"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Label>Date</Label>
                    <FormControl>
                      <Popover
                        open={datePopup}
                        onOpenChange={() => setDatePopup((curr) => !curr)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant={'ghost'}
                            className={'border justify-start'}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : ''}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            onDayFocus={() => setDatePopup(false)}
                            mode="single"
                            selected={field.value}
                            disabled={field.disabled}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label>Color</Label>
                    <ColorPicker {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} variant={'default'}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default AddMilestoneDialog
