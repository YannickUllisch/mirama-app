// app/(app)/organization/[organizationId]/settings/_components/SettingsSearchInput.tsx
'use client'
import { Search } from 'lucide-react'
import { useState } from 'react'

const SettingsSearchInput = () => {
  const [value, setValue] = useState('')

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-body-text/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className="w-full rounded-lg border border-hairline bg-surface-soft pl-8 pr-2.5 py-1.5 text-sm text-ink placeholder:text-body-text/50 focus:outline-none focus:ring-1 focus:ring-lava/40"
      />
    </div>
  )
}

export default SettingsSearchInput
