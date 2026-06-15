// app/(app)/tenant/[tenantId]/billing/_components/UsageSection.tsx
'use client'

import apiRequest from '@hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { BarChart2, Building2, FolderOpen, Users } from 'lucide-react'

const UsageSection = () => {
  const { data: usage, isLoading } = apiRequest.billing.fetchUsage.useQuery()

  if (isLoading) return null

  const rows = [
    {
      label: 'Organizations',
      icon: <Building2 className="w-3.5 h-3.5" />,
      value: usage?.organizations ?? 0,
    },
    {
      label: 'Members',
      icon: <Users className="w-3.5 h-3.5" />,
      value: usage?.members ?? 0,
    },
    {
      label: 'Projects',
      icon: <FolderOpen className="w-3.5 h-3.5" />,
      value: usage?.projects ?? 0,
    },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 bg-surface-dark">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
          <BarChart2 className="w-4 h-4 text-white/70" />
          Current usage
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 divide-x divide-hairline">
          {rows.map((row) => (
            <div key={row.label} className="px-4 first:pl-0 last:pr-0">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                {row.icon}
                {row.label}
              </span>
              <p className="text-2xl font-medium text-ink tabular-nums">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UsageSection
