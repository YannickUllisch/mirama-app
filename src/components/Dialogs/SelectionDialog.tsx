'use client'
import { X } from 'lucide-react'
import type React from 'react'
import type { FC } from 'react'
import { Button } from '../ui/button'

interface SelectionDialogProps {
  selectionAmount: number
  actionButton: React.ReactNode
  open: boolean
  onClose: () => void
}

const SelectionDialog: FC<SelectionDialogProps> = ({
  selectionAmount,
  actionButton,
  open,
  onClose,
}) => {
  if (!open) return null // Ensure the dialog is not rendered when closed

  return (
    <div
      className={`fixed min-w-[25%] outline outline-neutral-100 dark:outline-neutral-800 left-1/2 bottom-24 transform -translate-x-1/2 z-50 bg-background p-4 rounded-lg shadow-md dark:shadow-neutral-800 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Selection made</span>
        <X
          onClick={onClose}
          className="text-lg w-[18px] h-[18px] p-0 bg-transparent border-none cursor-pointer "
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          {`${selectionAmount} row(s) selected`}
        </span>
        {actionButton}
      </div>
    </div>
  )
}

export default SelectionDialog
