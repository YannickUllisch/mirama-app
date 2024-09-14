import React from 'react'
import { Button } from '../ui/button'

const ClearButton = ({ onClick }: { onClick: () => any }) => {
  return (
    <Button
      variant="outline"
      className="w-full dark:bg-neutral-900 dark:hover:bg-neutral-800"
      size="sm"
      onClick={onClick}
    >
      Clear
    </Button>
  )
}

export default ClearButton
