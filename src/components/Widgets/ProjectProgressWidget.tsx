'use client'

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { subDays, format } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card'
import { ChartTooltip } from '@ui/chart'

// Generate mock data for the last 14 days
const generateProgressData = () => {
  return Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i)
    return {
      date: format(date, 'MMM dd'),
      'Website Redesign': Math.floor(Math.random() * 30 + 40), // 40-70%
      'Mobile App': Math.floor(Math.random() * 20 + 20), // 20-40%
      'Marketing Campaign': Math.floor(Math.random() * 15 + 10), // 10-25%
    }
  })
}

const data = generateProgressData()

export function ProjectProgressChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Project Progress Timeline</CardTitle>
        <CardDescription>
          Track completion rates across active projects over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltip>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].payload.date}
                            </span>
                          </div>
                          {payload.map((entry) => (
                            <div
                              key={entry.dataKey}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="flex items-center gap-1 text-[0.70rem]">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: entry.color,
                                  }}
                                />
                                {entry.dataKey}
                              </span>
                              <span className="text-[0.70rem] font-bold">
                                {entry.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </ChartTooltip>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="Website Redesign"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Mobile App"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Marketing Campaign"
                stroke="#db2777"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
