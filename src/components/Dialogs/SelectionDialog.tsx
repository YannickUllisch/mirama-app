import { useTranslations } from 'next-intl'
import type React from 'react'
import type { FC } from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

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
  return (
    <>
      {open && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-24 z-50 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-3xl flex flex-col items-start w-72 shadow-sm">
          <div className="flex justify-between items-center w-full">
            <X onClick={onClose} className="w-6 h-6 cursor-pointer" />
            <p className="text-gray-600 dark:text-gray-400">{`${selectionAmount} row(s) selected`}</p>
            {actionButton}
          </div>
        </div>
      )}
    </>
  )
}

export default SelectionDialog
