'use client'

import { Badge } from '@src/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@src/components/ui/command'
import { cn } from '@src/lib/utils'
import { Command as CommandPrimitive } from 'cmdk'
import { Check, X as RemoveIcon } from 'lucide-react'
import type React from 'react'
import {
  createContext,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useContext,
  useState,
} from 'react'

type MultiSelectorProps = {
  values: string[]
  onValuesChange: (value: string[]) => void
  loop?: boolean
} & React.ComponentPropsWithoutRef<typeof CommandPrimitive>

interface MultiSelectContextProps {
  value: string[]
  onValueChange: (value: any) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null)

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext)
  if (!context) {
    throw new Error('useMultiSelect must be used within MultiSelectProvider')
  }
  return context
}

const MultiSelector = forwardRef<HTMLDivElement, MultiSelectorProps>(
  (
    {
      values: value,
      onValuesChange: onValueChange,
      loop = false,
      className,
      children,
      dir,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState('')
    const [open, setOpen] = useState<boolean>(false)
    const [activeIndex, setActiveIndex] = useState<number>(-1)

    const onValueChangeHandler = useCallback(
      (val: string) => {
        if (value.includes(val)) {
          onValueChange(value.filter((item) => item !== val))
        } else {
          onValueChange([...value, val])
        }
      },
      [value, onValueChange],
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const moveNext = () => {
          const nextIndex = activeIndex + 1
          setActiveIndex(
            nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex,
          )
        }

        const movePrev = () => {
          const prevIndex = activeIndex - 1
          setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex)
        }

        if ((e.key === 'Backspace' || e.key === 'Delete') && value.length > 0) {
          if (inputValue.length === 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChange(value.filter((item) => item !== value[activeIndex]))
              const newIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1
              setActiveIndex(newIndex)
            } else {
              onValueChange(
                value.filter((item) => item !== value[value.length - 1]),
              )
            }
          }
        } else if (e.key === 'Enter') {
          setOpen(true)
        } else if (e.key === 'Escape') {
          if (activeIndex !== -1) {
            setActiveIndex(-1)
          } else {
            setOpen(false)
          }
        } else if (dir === 'rtl') {
          if (e.key === 'ArrowRight') {
            movePrev()
          } else if (e.key === 'ArrowLeft' && (activeIndex !== -1 || loop)) {
            moveNext()
          }
        } else {
          if (e.key === 'ArrowLeft') {
            movePrev()
          } else if (e.key === 'ArrowRight' && (activeIndex !== -1 || loop)) {
            moveNext()
          }
        }
      },
      [value, inputValue, activeIndex, loop, dir, onValueChange],
    )

    return (
      <MultiSelectContext.Provider
        value={{
          value,
          onValueChange: onValueChangeHandler,
          open,
          setOpen,
          inputValue,
          setInputValue,
          activeIndex,
          setActiveIndex,
        }}
      >
        <Command
          ref={ref}
          onKeyDown={handleKeyDown}
          className={cn('overflow-visible bg-transparent flex flex-col w-full', className)}
          dir={dir}
          {...props}
        >
          {children}
        </Command>
      </MultiSelectContext.Provider>
    )
  },
)

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    renderValue?: (item: string) => React.ReactNode
  }
>(({ className, children, renderValue, ...props }, ref) => {
  const { value, onValueChange, activeIndex } = useMultiSelect()

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap gap-1.5 min-h-9 px-3 py-1.5 rounded-lg border border-border bg-background transition-colors',
        'focus-within:ring-[0.125rem] focus-within:ring-ring focus-within:border-primary/60',
        className,
      )}
      {...props}
    >
      {value.map((item, index) => (
        <Badge
          key={item}
          variant="outline"
          className={cn(
            'h-6 gap-1 px-2 rounded-md text-xs font-medium',
            activeIndex === index && 'ring-[0.125rem] ring-ring',
          )}
        >
          <span>{renderValue ? renderValue(item) : item}</span>
          <button
            aria-label={`Remove ${item} option`}
            type="button"
            onMouseDown={mousePreventDefault}
            onClick={() => onValueChange(item)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Remove {item} option</span>
            <RemoveIcon className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {children}
    </div>
  )
})

MultiSelectorTrigger.displayName = 'MultiSelectorTrigger'

const MultiSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const { setOpen, inputValue, setInputValue, activeIndex, setActiveIndex } =
    useMultiSelect()
  const resolvedValue = inputValue ? inputValue : ''
  return (
    <CommandPrimitive.Input
      {...props}
      ref={ref}
      value={resolvedValue}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onBlur={() => setOpen(false)}
      onClick={() => {
        setOpen((prev) => !prev)
        setActiveIndex(-1)
      }}
      className={cn(
        'flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground',
        activeIndex !== -1 && 'caret-transparent',
        className,
      )}
    />
  )
})

MultiSelectorInput.displayName = 'MultiSelectorInput'

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useMultiSelect()
  return (
    <div ref={ref} className="relative">
      {open && (
        <div className="absolute z-10 top-full mt-1.5 left-0 w-full">
          {children}
        </div>
      )}
    </div>
  )
})

MultiSelectorContent.displayName = 'MultiSelectorContent'

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground p-1 max-h-60 overflow-y-auto',
        className,
      )}
    >
      {children}
      <CommandEmpty>
        <span className="text-sm text-muted-foreground px-2 py-1.5 block">No results found</span>
      </CommandEmpty>
    </CommandList>
  )
})

MultiSelectorList.displayName = 'MultiSelectorList'

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, value, children, ...props }, ref) => {
  const { value: Options, onValueChange, setInputValue } = useMultiSelect()

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const isIncluded = Options.includes(value)
  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => {
        onValueChange(value)
        setInputValue('')
      }}
      className={cn(
        'flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors',
        'aria-selected:bg-primary/10 aria-selected:text-primary',
        isIncluded && 'opacity-50 cursor-default',
        props.disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      onMouseDown={mousePreventDefault}
    >
      {children}
      {isIncluded && <Check className="h-3.5 w-3.5 shrink-0" />}
    </CommandItem>
  )
})

MultiSelectorItem.displayName = 'MultiSelectorItem'

export {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
}
