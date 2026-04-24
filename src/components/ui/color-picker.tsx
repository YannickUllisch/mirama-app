'use client'

// src/components/ui/color-picker.tsx
import type { ButtonProps } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { useForwardedRef } from '@src/modules/shared/hooks/utils/use-forwarded-ref'
import { cn } from '@src/lib/utils'
import { forwardRef, useMemo, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps
>(({ disabled, value, onChange, onBlur, className }, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef)
  const [open, setOpen] = useState(false)

  const parsedValue = useMemo(() => {
    return value || '#FFFFFF'
  }, [value])

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            // Input-style: whisper border, 4px radius, white bg
            'h-9 w-9 shrink-0 rounded-[4px] border border-input bg-background p-1 transition-all',
            'hover:border-mirama-blue focus:outline-none focus:ring-2 focus:ring-focus-blue/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          )}
          onClick={() => setOpen(true)}
          onBlur={onBlur}
        >
          <div
            className="h-full w-full rounded-[2px]"
            style={{ backgroundColor: parsedValue }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={8}
        className="w-56 p-3 rounded-xl border border-black/10 dark:border-white/10 bg-card shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.85px,rgba(0,0,0,0.02)_0px_0.8px_2.93px,rgba(0,0,0,0.01)_0px_0.175px_1.04px] flex flex-col gap-3"
      >
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <Used for styling>
          dangerouslySetInnerHTML={{
            __html: `
            .react-colorful { width: 100% !important; height: 144px !important; border-radius: 8px !important; }
            .react-colorful__saturation { border-bottom: none !important; border-radius: 8px 8px 0 0 !important; }
            .react-colorful__hue { height: 10px !important; border-radius: 0 0 8px 8px !important; }
            .react-colorful__pointer { width: 14px !important; height: 14px !important; border: 2px solid white !important; box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important; }
          `,
          }}
        />

        <HexColorPicker color={parsedValue} onChange={onChange} />

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold [letter-spacing:0.125px] text-warm-gray-300 uppercase shrink-0">
            HEX
          </span>
          <Input
            className="h-7 text-xs font-mono"
            maxLength={7}
            onChange={(e) => onChange(e?.currentTarget?.value)}
            ref={ref}
            value={parsedValue.toUpperCase()}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
})
ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
