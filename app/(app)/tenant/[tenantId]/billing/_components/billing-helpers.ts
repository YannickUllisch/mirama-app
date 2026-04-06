// app/(app)/tenant/[tenantId]/billing/_components/billing-helpers.ts
import { DateTime } from 'luxon'

export const statusStyles: Record<
  string,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: 'Active',
    className:
      'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400',
  },
  TRIALING: {
    label: 'Trial',
    className:
      'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400',
  },
  PAST_DUE: {
    label: 'Past Due',
    className:
      'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400',
  },
  CANCELED: {
    label: 'Canceled',
    className:
      'text-neutral-500 border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400',
  },
  UNPAID: {
    label: 'Unpaid',
    className:
      'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400',
  },
}

export const fmtPrice = (cents: number) =>
  cents === 0
    ? 'Free'
    : `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: cents % 100 !== 0 ? 2 : 0 })}`

export const fmtDate = (d: Date | string) =>
  DateTime.fromJSDate(new Date(d)).toFormat('d MMM yyyy')

export const isUnlimited = (n: number) => n <= 0 || n >= 999
