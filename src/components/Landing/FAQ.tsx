import { Badge } from '@src/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@src/components/ui/accordion'

export const LandingFAQ = () => (
  <div className="w-full py-20 lg:py-40 bg-background">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge variant={'secondary'}>FAQs</Badge>
          <div className="flex gap-2 flex-col">
            <h4 className="text-3xl md:text-5xl  tracking-tighter max-w-xl text-center font-regular">
              Everything You Need to Know
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Have questions? Find answers to the most common inquiries the app.
            </p>
          </div>
          <div className="bg-secondary rounded-md text-white/70 dark:text-secondary dark:bg-white p-3 px-3">
            <span className="gap-1 flex flex-col sm:flex-row">
              Reach out to us manually at
              <a
                href="mailto:info@mirage-studio.xyz"
                className="font-light text-white/80 dark:text-secondary hover:underline underline-offset-4"
              >
                info@mirage-studio.xyz
              </a>
            </span>
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-platform">
              <AccordionTrigger>What is this platform for?</AccordionTrigger>
              <AccordionContent>
                Our platform helps teams and individuals streamline task and
                project management, boosting productivity and collaboration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-get-started">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Simply sign up, create your first project, and start organizing
                your tasks with ease.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pricing">
              <AccordionTrigger>Is there a free plan?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer a free plan with essential features to get you
                started.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="collaboration">
              <AccordionTrigger>
                Can I collaborate with my team?
              </AccordionTrigger>
              <AccordionContent>
                Absolutely! Invite team members, assign tasks, and track
                progress in real-time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
)
