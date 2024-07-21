import type React from 'react'
import type { FC } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '@/src/components/ui/button'

interface ConfirmationDialogProps {
  dialogTitle: string
  dialogDesc: string
  submitButtonText: string
  dialogTrigger: React.ReactNode
  onConfirmation: (id?: string) => void
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  dialogTitle,
  dialogDesc,
  dialogTrigger,
  onConfirmation,
  submitButtonText,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDesc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="link">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={() => onConfirmation()}
              className="bg-red-600 hover:bg-red-500 dark:text-white"
            >
              {submitButtonText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
