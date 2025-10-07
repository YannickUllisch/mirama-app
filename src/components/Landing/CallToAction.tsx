import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import { Mails, MoveRight } from 'lucide-react'
import HoverLink from '../HoverLink'

export const CallToAction = () => (
  <div className="w-full">
    <div className="flex flex-col text-center bg-secondary p-6 lg:p-28 gap-8 items-center">
      <div>
        <Badge
          variant={'outline'}
          className="text-white font-light border-white"
        >
          Get Started Today
        </Badge>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-3xl text-text-inverted dark:text-white md:text-7xl tracking-tighter max-w-5xl font-regular">
          Elevate Your Productivity
        </h3>
        <p className="text-lg dark:text-text/60 leading-relaxed tracking-tight text-muted/70 max-w-3xl">
          Streamline your workflow, collaborate effortlessly, and complete
          projects faster. Join thousands of teams boosting their efficiency
          with our task and project management platform.
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <HoverLink href={'/contact'}>
          <Button className="gap-4" variant="outline">
            Contact Us <Mails className="w-4 h-4" />
          </Button>
        </HoverLink>
        <HoverLink href={'/auth/login'}>
          <Button className="gap-4" variant={'primary'}>
            Get Started now <MoveRight className="w-4 h-4" />
          </Button>
        </HoverLink>
      </div>
    </div>
  </div>
)
