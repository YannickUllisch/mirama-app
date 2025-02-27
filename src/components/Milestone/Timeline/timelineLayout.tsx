'use client'

import type React from 'react'
import type { ReactNode } from 'react'
import { Timeline, TimelineItem } from './timeline'
import { motion } from 'framer-motion'
import type { Milestone } from '@prisma/client'
import { Flag } from 'lucide-react'
import { DateTime } from 'luxon'

export type TimelineSize = 'sm' | 'md' | 'lg'
export type TimelineStatus = 'completed' | 'in-progress' | 'pending'
export type TimelineColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'destructive'
export interface TimelineElement {
  id: number
  date: string
  title: string
  description: string
  icon?: ReactNode | (() => ReactNode)
  status?: TimelineStatus
  color?: TimelineColor
  size?: TimelineSize
  loading?: boolean
  error?: string
}

export interface TimelineProps {
  items: TimelineElement[]
  size?: TimelineSize
  animate?: boolean
  iconColor?: TimelineColor
  connectorColor?: TimelineColor
  className?: string
}

interface TimelineLayoutProps {
  items: Milestone[]
  size?: 'sm' | 'md' | 'lg'
  iconColor?: 'primary' | 'secondary' | 'muted' | 'accent'
  customIcon?: React.ReactNode
  animate?: boolean
  connectorColor?: 'primary' | 'secondary' | 'muted' | 'accent'
  className?: string
}

export const TimelineLayout = ({
  items,
  size = 'md',
  animate = true,
  connectorColor,
  className,
}: TimelineLayoutProps) => {
  return (
    <Timeline size={size} className={className}>
      {[...items].reverse().map((item, index) => (
        <motion.div
          key={item.id}
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
        >
          <TimelineItem
            date={DateTime.fromJSDate(new Date(item.date))}
            title={item.title}
            description={'teesta'}
            icon={<Flag />}
            iconColor={item.colors}
            connectorColor={connectorColor}
            showConnector={index !== items.length - 1}
          />
        </motion.div>
      ))}
    </Timeline>
  )
}
