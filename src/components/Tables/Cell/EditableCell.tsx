'use client'

import type React from 'react'

import { cn } from '@src/lib/utils'
import { Button } from '@ui/button'
import { Calendar } from '@ui/calendar'
import { Checkbox } from '@ui/checkbox'
import { Input } from '@ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { format } from 'date-fns'
import { CalendarIcon, Check, Edit2, Loader2, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'

export enum EditableCellType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
}

interface EditableCellProps {
  value: string | number | boolean | Date | null | undefined
  onSave: (value: string | number | boolean | Date | null | undefined) => void
  type?: EditableCellType
  options?: { value: number | string; label: string }[]
  className?: string
  displayValue?: string | React.ReactNode // Optional custom display value
  selectType?: 'number' | 'string' // Type for select options
  isLoading?: boolean
  disabled?: boolean
}

export function EditableCell({
  value,
  onSave,
  type = EditableCellType.TEXT,
  options = [],
  className = '',
  displayValue,
  selectType,
  isLoading,
  disabled,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
    setIsDatePickerOpen(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
    setIsDatePickerOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleDateReset = () => {
    setEditValue(undefined)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        {type === EditableCellType.BOOLEAN ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              disabled={isLoading}
              checked={Boolean(editValue)}
              onCheckedChange={(checked) => setEditValue(checked)}
              className="h-4 w-4"
            />
          </div>
        ) : type === EditableCellType.DATE ? (
          /* Added date picker with reset functionality */
          <div className="flex items-center gap-2">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-8 min-w-[200px] justify-start text-left font-normal',
                    !editValue && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editValue instanceof Date
                    ? format(editValue, 'PPP')
                    : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  disabled={isLoading}
                  mode="single"
                  selected={editValue instanceof Date ? editValue : undefined}
                  onSelect={(date) => {
                    setEditValue(date)
                    setIsDatePickerOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              size="sm"
              variant="ghost"
              disabled={isLoading}
              onClick={handleDateReset}
              className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
              title="Reset date"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        ) : type === EditableCellType.SELECT ? (
          <Select
            value={editValue?.toString() || ''}
            disabled={isLoading}
            onValueChange={(value) =>
              selectType === 'number'
                ? setEditValue(Number(value))
                : setEditValue(value)
            }
          >
            <SelectTrigger className="h-8 min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={type === EditableCellType.NUMBER ? 'number' : 'text'}
            value={editValue?.toString() || ''}
            onChange={(e) =>
              setEditValue(
                type === EditableCellType.NUMBER
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="h-8 min-w-[100px]"
            autoFocus
          />
        )}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isLoading}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={isLoading}
            onClick={handleCancel}
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  const getDisplayText = () => {
    if (displayValue) return displayValue

    if (type === EditableCellType.BOOLEAN) {
      return <Checkbox checked={Boolean(value)} disabled className="h-4 w-4" />
    }

    if (type === EditableCellType.DATE) {
      if (!value) return ''
      if (value instanceof Date) return value.toString()
      return value.toString()
    }

    if (type === EditableCellType.SELECT && options.length > 0) {
      return (
        options.find((opt) => opt.value === value)?.label || value?.toString()
      )
    }

    return value?.toString() || ''
  }

  return (
    <div className="flex items-center gap-2 group">
      <div className={`flex-1 ${className}`}>{getDisplayText()}</div>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          disabled={isLoading || disabled}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:group-hover:opacity-0"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
