// app/(app)/portal/_components/SecondaryPortalCard.tsx
'use client'
import { cn } from '@src/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SecondaryPortalCardProps {
  icon: LucideIcon
  label: string
  description: string
  onClick?: () => void
}

const SecondaryPortalCard = ({
  icon: Icon,
  label,
  description,
  onClick,
}: SecondaryPortalCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative text-left w-full rounded-xl transition-all duration-200 p-5 flex flex-col gap-4',
        'bg-surface-medium cursor-pointer hover:-translate-y-1 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-surface-dark">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-ink/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs mt-0.5 leading-relaxed text-ink/55">
          {description}
        </p>
      </div>
    </button>
  )
}

export default SecondaryPortalCard
