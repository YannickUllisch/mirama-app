// app/(app)/tenant/[tenantId]/billing/_components/billing-helpers.ts
import { DateTime } from 'luxon'

export const statusStyles: Record<
  string,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: 'Active',
    className: 'text-success border-success/20 bg-success/10',
  },
  TRIALING: {
    label: 'Trial',
    className: 'text-mirama border-mirama/20 bg-mirama/10',
  },
  PAST_DUE: {
    label: 'Past due',
    className: 'text-warning border-warning/30 bg-warning/10',
  },
  CANCELED: {
    label: 'Canceled',
    className: 'text-body-text border-hairline bg-surface-soft',
  },
  UNPAID: {
    label: 'Unpaid',
    className: 'text-destructive border-destructive/20 bg-destructive/10',
  },
}

export const fmtPrice = (cents: number) =>
  cents === 0
    ? 'Free'
    : `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: cents % 100 !== 0 ? 2 : 0 })}`

export const fmtDate = (d: Date | string) =>
  DateTime.fromJSDate(new Date(d)).toFormat('d MMM yyyy')
