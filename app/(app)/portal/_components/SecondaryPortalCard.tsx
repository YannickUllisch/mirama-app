// app/(app)/portal/_components/SecondaryPortalCard.tsx
'use client'
import { cn } from '@src/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

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
        'group text-left w-full rounded-xl transition-all duration-200',
        'border border-hairline bg-canvas flex items-center gap-4 px-5 py-4',
        'hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-surface-dark">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs mt-0.5 text-body-text leading-relaxed truncate">
          {description}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-ink/25 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
    </button>
  )
}

export default SecondaryPortalCard
