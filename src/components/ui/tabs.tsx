// src/components/ui/tabs.tsx
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@src/lib/utils'
import * as React from 'react'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Warm white pill container with whisper border
      'inline-flex h-9 items-center justify-center rounded-[4px] bg-warm-white dark:bg-warm-dark/50 border border-black/10 dark:border-white/10 p-1 gap-0.5',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // 15px / weight 500 — nav/button text in DESIGN.md
      'inline-flex items-center justify-center whitespace-nowrap rounded-[4px] px-3 py-1 text-[15px] font-medium transition-all outline-none',
      'text-warm-gray-500 dark:text-warm-gray-300',
      'hover:text-foreground hover:bg-white/60 dark:hover:bg-white/5',
      'focus-visible:ring-2 focus-visible:ring-focus-blue/30',
      'disabled:pointer-events-none disabled:opacity-40',
      // Active: white bg (or dark surface) with whisper border shadow
      'data-[state=active]:bg-white dark:data-[state=active]:bg-warm-dark data-[state=active]:text-foreground data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.08)]',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-3 outline-none focus-visible:ring-2 focus-visible:ring-focus-blue/30',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
