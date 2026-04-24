// src/components/ui/tooltip.tsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@src/lib/utils'
import * as React from 'react'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Whisper border, white bg, soft card shadow, 8px radius
      'z-50 overflow-hidden rounded-lg border border-black/10 dark:border-white/10',
      'bg-card px-3 py-1.5',
      'shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.85px,rgba(0,0,0,0.02)_0px_0.8px_2.93px]',
      // 12px / weight 500 — caption / micro-label per DESIGN.md
      'text-[12px] font-medium text-foreground',
      'animate-in fade-in-0 zoom-in-95 duration-150',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
