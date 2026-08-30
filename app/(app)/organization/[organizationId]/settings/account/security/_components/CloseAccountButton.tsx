// app/(app)/organization/[organizationId]/settings/account/security/_components/CloseAccountButton.tsx
'use client'

import { ConfirmationDialog } from '@src/components/Dialogs/ConfirmationDialog'
import { Button } from '@ui/button'
import { LogOut } from 'lucide-react'

const CloseAccountButton = () => {
  return (
    <ConfirmationDialog
      title="Are you sure?"
      description="Removing your account can not be undone."
      onCancel={() => null}
      onSubmit={() => undefined}
    >
      <Button
        className="gap-2 hover:text-red-500 hover:no-underline hover:bg-hover"
        variant="destructive"
      >
        <LogOut className="w-3.5 h-3.5" />
        Close account
      </Button>
    </ConfirmationDialog>
  )
}

export default CloseAccountButton
