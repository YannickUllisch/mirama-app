'use client'

import { forwardRef, useMemo, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { cn } from '@src/lib/utils'
import type { ButtonProps } from '@src/components/ui/button'
import { Button } from '@src/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { Input } from '@src/components/ui/input'
import { useForwardedRef } from '@src/hooks/use-forwarded-ref'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef)
    const [open, setOpen] = useState(false)

    const parsedValue = useMemo(() => {
      return value || '#FFFFFF'
    }, [value])

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn(
              'block rounded-full outline outline-offset-1',
              className,
            )}
            name={name}
            onClick={() => {
              setOpen(true)
            }}
            size="icon"
            style={{
              backgroundColor: parsedValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <HexColorPicker color={parsedValue} onChange={onChange} />
          <Input
            className="w-full"
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value)
            }}
            ref={ref}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    )
  },
)
ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
