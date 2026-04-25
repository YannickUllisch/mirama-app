'use client'

import { useForwardedRef } from '@src/modules/shared/hooks/utils/use-forwarded-ref'
import type { ButtonProps } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
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
            'group relative h-10 w-10 shrink-0 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-1 transition-all hover:border-primary/40 focus:outline-hidden focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          onClick={() => setOpen(true)}
          onBlur={onBlur}
        >
          <div
            className="h-full w-full rounded-lg shadow-xs"
            style={{ backgroundColor: parsedValue }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={8}
        className="w-60 p-3 rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md shadow-2xl flex flex-col gap-3"
      >
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <Used for styling>
          dangerouslySetInnerHTML={{
            __html: `
            .react-colorful { width: 100% !important; height: 160px !important; border-radius: 12px !important; }
            .react-colorful__saturation { border-bottom: none !important; border-radius: 12px 12px 0 0 !important; }
            .react-colorful__hue { height: 12px !important; border-radius: 0 0 12px 12px !important; }
            .react-colorful__pointer { width: 16px !important; height: 16px !important; border: 2px solid white !important; box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important; }
          `,
          }}
        />

        <HexColorPicker color={parsedValue} onChange={onChange} />

        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1">
            HEX
          </div>
          <Input
            className="h-8 text-xs font-bold font-mono"
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
