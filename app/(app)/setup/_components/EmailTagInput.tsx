'use client'

import { Badge } from '@ui/badge'
import { X } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

const emailSchema = z.string().email()

type EmailTagInputProps = {
  value: string[]
  onChange: (emails: string[]) => void
}

const splitEmails = (raw: string) =>
  raw
    .split(/[\s,]+/)
    .map((email) => email.trim())
    .filter(Boolean)

const EmailTagInput = ({ value, onChange }: EmailTagInputProps) => {
  const [input, setInput] = useState('')

  const addEmails = (raw: string) => {
    const valid = splitEmails(raw).filter(
      (email) => emailSchema.safeParse(email).success && !value.includes(email),
    )
    if (valid.length > 0) onChange([...value, ...valid])
    setInput('')
  }

  return (
    <div className="min-h-11 w-full rounded-md border border-hairline bg-canvas px-3 py-2 flex flex-wrap items-center gap-1.5 focus-within:ring-1 focus-within:ring-ink">
      {value.map((email) => (
        <Badge key={email} variant="outline" className="gap-1 h-6 rounded-md">
          {email}
          <button
            type="button"
            aria-label={`Remove ${email}`}
            onClick={() => onChange(value.filter((e) => e !== email))}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        value={input}
        onChange={(e) => {
          if (/[\s,]$/.test(e.target.value)) {
            addEmails(e.target.value)
          } else {
            setInput(e.target.value)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addEmails(input)
          } else if (
            e.key === 'Backspace' &&
            input === '' &&
            value.length > 0
          ) {
            onChange(value.slice(0, -1))
          }
        }}
        onPaste={(e) => {
          e.preventDefault()
          addEmails(e.clipboardData.getData('text'))
        }}
        onBlur={() => addEmails(input)}
        placeholder={
          value.length === 0 ? 'email@gmail.com, email2@gmail.com' : ''
        }
        className="flex-1 min-w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

export default EmailTagInput
