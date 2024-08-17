import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@src/components/ui/accordion'
import { cn } from '@src/lib/utils'

interface GeneralAccordion {
  trigger: string | React.ReactNode
  defaultOpen: boolean
  styling?: {
    accordionClassname?: string
  }
}

const GeneralAccordion: FC<PropsWithChildren<GeneralAccordion>> = ({
  children,
  trigger,
  defaultOpen,
  styling,
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn('', styling?.accordionClassname)}
      defaultValue={defaultOpen ? 'item-1' : undefined}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>{trigger}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default GeneralAccordion
