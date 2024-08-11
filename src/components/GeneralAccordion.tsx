import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@src/components/ui/accordion'

interface GeneralAccordion {
  trigger: string | React.ReactNode
}

const GeneralAccordion: FC<PropsWithChildren<GeneralAccordion>> = ({
  children,
  trigger,
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{trigger}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default GeneralAccordion
