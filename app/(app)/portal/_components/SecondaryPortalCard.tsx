// app/(app)/portal/_components/SecondaryPortalCard.tsx
'use client'
import { cn } from '@src/lib/utils'
import { ArrowRight, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type CardVariant = 'dark' | 'cream' | 'mint' | 'mustard' | 'peach'

interface VariantStyle {
  card: string
  text: string
  subtext: string
  iconBg: string
  arrow: string
}

const VARIANTS: Record<CardVariant, VariantStyle> = {
  dark: {
    card: 'bg-surface-dark',
    text: 'text-white',
    subtext: 'text-white/60',
    iconBg: 'bg-white/15',
    arrow: 'text-white/40 group-hover:text-white',
  },
  cream: {
    card: 'bg-signature-cream',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/10',
    arrow: 'text-ink/35 group-hover:text-ink',
  },
  mint: {
    card: 'bg-signature-mint',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/10',
    arrow: 'text-ink/35 group-hover:text-ink',
  },
  mustard: {
    card: 'bg-signature-mustard',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/10',
    arrow: 'text-ink/35 group-hover:text-ink',
  },
  peach: {
    card: 'bg-signature-peach',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/10',
    arrow: 'text-ink/35 group-hover:text-ink',
  },
}

interface SecondaryPortalCardProps {
  icon: LucideIcon
  label: string
  description: string
  variant: CardVariant
  comingSoon?: boolean
  onClick?: () => void
}

const SecondaryPortalCard = ({
  icon: Icon,
  label,
  description,
  variant,
  comingSoon,
  onClick,
}: SecondaryPortalCardProps) => {
  const v = VARIANTS[variant]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={comingSoon}
      className={cn(
        'group relative text-left w-full rounded-xl transition-all duration-200 p-5 flex flex-col gap-4',
        comingSoon
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        v.card,
      )}
    >
      {/* Icon row */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
            v.iconBg,
          )}
        >
          {comingSoon ? (
            <Lock className={cn('w-4 h-4', v.subtext)} />
          ) : (
            <Icon className={cn('w-4 h-4', v.text)} />
          )}
        </div>
        {comingSoon ? (
          <span
            className={cn(
              'text-[10px] font-medium border rounded px-1.5 py-px leading-none',
              variant === 'dark'
                ? 'border-white/25 text-white/50'
                : 'border-ink/20 text-ink/40',
            )}
          >
            Soon
          </span>
        ) : (
          <ArrowRight
            className={cn(
              'w-3.5 h-3.5 mt-0.5 transition-all group-hover:translate-x-0.5',
              v.arrow,
            )}
          />
        )}
      </div>

      {/* Content */}
      <div>
        <p className={cn('text-sm font-medium', v.text)}>{label}</p>
        <p className={cn('text-xs mt-0.5 leading-relaxed', v.subtext)}>
          {description}
        </p>
      </div>
    </button>
  )
}

export default SecondaryPortalCard
