'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card'
import { ChartTooltip } from '@ui/chart'

// Mock data for task distribution
const data = [
  {
    name: 'TASK',
    high: 4,
    medium: 3,
    low: 2,
  },
  {
    name: 'FEATURE',
    high: 3,
    medium: 4,
    low: 1,
  },
  {
    name: 'ISSUE',
    high: 2,
    medium: 2,
    low: 3,
  },
  {
    name: 'STORY',
    high: 1,
    medium: 5,
    low: 2,
  },
  {
    name: 'EPIC',
    high: 2,
    medium: 1,
    low: 1,
  },
]

export function TaskDistributionChart() {
  return (
    <Card className="col-span-4 bg-background">
      <CardHeader>
        <CardTitle>Task Type Distribution</CardTitle>
        <CardDescription>
          Breakdown of tasks by type and priority level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="name"
                stroke="bg-red-500"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Bar
                dataKey="high"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                stackId="stack"
              />
              <Bar
                dataKey="medium"
                fill="#eab308"
                radius={[4, 4, 0, 0]}
                stackId="stack"
              />
              <Bar
                dataKey="low"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                stackId="stack"
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].payload.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-[0.70rem]">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              High Priority
                            </span>
                            <span className="text-[0.70rem] font-bold">
                              {payload[0].payload.high}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-[0.70rem]">
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                              Medium Priority
                            </span>
                            <span className="text-[0.70rem] font-bold">
                              {payload[0].payload.medium}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-[0.70rem]">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              Low Priority
                            </span>
                            <span className="text-[0.70rem] font-bold">
                              {payload[0].payload.low}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            High Priority
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            Medium Priority
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Low Priority
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
