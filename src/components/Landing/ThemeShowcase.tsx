'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@ui/badge'
import { GripVertical, Moon, Sun } from 'lucide-react'

export const ThemeShowcase = () => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true })

  const [inset, setInset] = useState<number>(50)
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false)

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return

    const rect = e.currentTarget.getBoundingClientRect()
    let x = 0

    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left
    } else if ('clientX' in e) {
      x = e.clientX - rect.left
    }

    const percentage = (x / rect.width) * 100
    setInset(percentage)
  }

  return (
    <div className="w-full py-20 lg:py-40 bg-background">
      <div className="container mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col text-center justify-center items-center gap-4 mb-20"
        >
          <Badge variant="secondary">Themes</Badge>
          <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
            Light or Dark, You Choose
          </h2>
          <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
            Switch seamlessly between light and dark modes. Your eyes, your
            choice.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Dark mode image */}
          <div className="pt-12 w-full">
            <div
              className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none"
              onMouseMove={onMouseMove}
              onMouseUp={() => setOnMouseDown(false)}
              onTouchMove={onMouseMove}
              onTouchEnd={() => setOnMouseDown(false)}
            >
              <div
                className="bg-muted h-full w-1 absolute z-20 top-0 -ml-1 select-none"
                style={{
                  left: `${inset}%`,
                }}
              >
                <button
                  type="button"
                  className="bg-muted rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center"
                  onTouchStart={(e) => {
                    setOnMouseDown(true)
                    onMouseMove(e)
                  }}
                  onMouseDown={(e) => {
                    setOnMouseDown(true)
                    onMouseMove(e)
                  }}
                  onTouchEnd={() => setOnMouseDown(false)}
                  onMouseUp={() => setOnMouseDown(false)}
                >
                  <GripVertical className="h-4 w-4 select-none" />
                </button>
              </div>
              <Image
                src={'/test.png'}
                alt="feature8"
                width={1920}
                height={1080}
                priority
                className="absolute left-0 top-0 z-10 w-full h-full aspect-video rounded-2xl select-none border"
                style={{
                  clipPath: `inset(0 0 0 ${inset}%)`,
                }}
              />
              <Image
                src={'/test2.png'}
                alt="darkmode-feature8.png"
                width={1920}
                height={1080}
                priority
                className="absolute left-0 top-0 w-full h-full aspect-video rounded-2xl select-none border"
              />
            </div>
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-primary shadow-lg flex items-center justify-center">
              <div className="absolute inset-0 flex">
                <div className="flex-1 flex items-center justify-end pr-1">
                  <Sun className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 flex items-center justify-start pl-1">
                  <Moon className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Sun className="w-5 h-5" />
              <h3 className="text-xl font-semibold">Light Mode</h3>
            </div>
            <p className="text-muted-foreground">
              Perfect for daytime use. Clean, crisp, and easy on the eyes with
              carefully chosen colors and contrasts.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Moon className="w-5 h-5" />
              <h3 className="text-xl font-semibold">Dark Mode</h3>
            </div>
            <p className="text-muted-foreground">
              Reduce eye strain at night. Our dark theme is designed for
              comfortable viewing in low-light environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
