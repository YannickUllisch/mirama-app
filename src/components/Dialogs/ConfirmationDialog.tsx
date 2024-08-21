import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
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
import { Button } from '@src/components/ui/button'

interface ConfirmationDialogProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  dialogTitle: string
  dialogDesc: string
  submitButtonText: string
  onConfirmation: (id?: string) => void
}

const ConfirmationDialog: FC<PropsWithChildren<ConfirmationDialogProps>> = ({
  dialogTitle,
  dialogDesc,
  submitButtonText,
  children,
  onConfirmation,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
