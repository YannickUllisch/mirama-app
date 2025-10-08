import { Button } from '@src/components/ui/button'
import { motion } from 'framer-motion'
import { CheckCircle, LockOpen, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export const LandingView = () => {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(
    () => ['smarter', 'faster', 'smoother', 'effortless', 'powerful'],
    [],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1))
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  return (
    <div className="w-full pb-48 bg-background">
      <div className="container mx-auto">
        <div className="flex gap-8 pt-20 lg:pt-36 items-center justify-center flex-col text-center">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Open for public registrations now!
              <LockOpen className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter font-regular">
              <span>Take control & supercharge your projects</span>
              <span className="relative flex w-full justify-center overflow-hidden md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={title}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
              Ditch the chaos. Our powerful task and project management tool
              helps you organize, collaborate, and get more done — without the
              headache.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Get a Demo <CheckCircle className="w-4 h-4" />
            </Button>
            <Link href={'/auth/login'}>
              <Button size="lg" className="gap-4" variant={'primary'}>
                Get Started <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
