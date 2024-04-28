import type React from 'react'
import type { FC } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@src/components/ui/accordion'

interface GeneralAccordion {
  accordionContent: React.ReactNode
  trigger: string
}

const GeneralAccordion: FC<GeneralAccordion> = (obj) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{obj.trigger}</AccordionTrigger>
        <AccordionContent>{obj.accordionContent}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default GeneralAccordion
