import React from 'react'
import { Button } from '../ui/button'

const ClearButton = ({ onClick }: { onClick: () => any }) => {
  return (
    <Button
      className="w-full px-2"
      variant="secondary"
      size="sm"
      onClick={onClick}
    >
      Clear
    </Button>
  )
}

export default ClearButton
