'use client'
import type { Expense, Project } from '@prisma/client'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@src/components/ui/chart'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface BudgetExpenseChartData {
  name: string // Use project name as the key
  budget?: number
  expenses: number
}

const chartConfig: ChartConfig = {
  budget: {
    label: 'Budget',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
}

export const BudgetExpenseBarChart = ({
  projects,
}: {
  projects: (Project & { expenses: Expense[] })[]
}) => {
  // Transform projects into chartData
  const chartData: BudgetExpenseChartData[] | undefined = useMemo(() => {
    if (!projects) {
      return undefined
    }

    return projects.map((project) => {
      const totalExpenses = project.expenses?.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      )

      return {
        name: project.name,
        budget: project.budget ?? undefined,
        expenses: totalExpenses,
      }
    })
  }, [projects])

  return (
    <Card className="max-w-[500px] max-h-[350px] shadow-none dark:bg-neutral-900">
      <CardHeader>
        <CardTitle>All Projects Budgets vs. Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="budget" fill={chartConfig.budget.color} radius={4} />
            <Bar
              dataKey="expenses"
              fill={chartConfig.expenses.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
