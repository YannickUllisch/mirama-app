import type { LucideIcon } from 'lucide-react'

const MetricCard = ({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
}) => (
  <div className="p-5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
    <div className="flex items-center justify-between text-neutral-500">
      <Icon className="w-5 h-5" />
      {trend && (
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-neutral-500 font-medium">{label}</p>
    </div>
  </div>
)

export default MetricCard
