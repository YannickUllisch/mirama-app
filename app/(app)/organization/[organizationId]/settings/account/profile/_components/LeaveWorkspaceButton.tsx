'use client'

import { ConfirmationDialog } from '@src/components/Dialogs/ConfirmationDialog'

const LeaveWorkspaceButton = () => {
  return (
    <ConfirmationDialog
      title="Are you sure?"
      description="You will lose access to this workspace and need a new invitation to rejoin."
      onCancel={() => null}
      onSubmit={() => undefined}
    >
      <button
        type="button"
        className="text-sm font-medium text-lava hover:underline"
      >
        Leave workspace
      </button>
    </ConfirmationDialog>
  )
}

export default LeaveWorkspaceButton
