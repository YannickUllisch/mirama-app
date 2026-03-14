'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@ui/badge'

const features = [
  {
    title: 'Kanban Task View',
    description:
      'Visualize your workflow with our intuitive Kanban board. Drag and drop tasks between columns, set priorities, and track progress effortlessly. Perfect for agile teams and visual project management.',
    image: '/test.png',
  },
  {
    title: 'Gantt Timeline',
    description:
      'Plan and schedule projects with our powerful Gantt chart view. See dependencies, milestones, and project timeline at a glance. Ideal for complex projects and long-term planning.',
    image: '/test2.png',
  },
  {
    title: 'Analytics Dashboard',
    description:
      "Get insights into your team's performance with detailed analytics. Track productivity metrics, identify bottlenecks, and optimize workflows with data-driven decisions.",
    image: '/test3.png',
  },
]

const FeatureSection = ({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {feature.title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
      <div
        className={`relative aspect-[16/9] ${
          index % 2 === 1 ? 'lg:order-1' : ''
        }`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-lg border bg-background">
          <Image
            src={feature.image || '/placeholder.svg'}
            alt={feature.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      </div>
    </motion.div>
  )
}

export const FeaturesShowcase = () => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <div className="w-full py-20 lg:py-40 bg-muted dark:bg-neutral-900">
      <div className="container mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.5 }}
          className="flex flex-col text-center justify-center items-center gap-4 mb-20"
        >
          <Badge variant="secondary">Features</Badge>
          <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
            Powerful Tools for Every Need
          </h2>
          <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
            Discover the features that make our platform the perfect choice for
            your team
          </p>
        </motion.div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <FeatureSection
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
