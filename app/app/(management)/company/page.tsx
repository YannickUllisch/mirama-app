// 'use client'
// import { Button } from '@src/components/ui/button'
// import { postResource } from '@src/lib/api/postResource'
// import { signIn, useSession } from 'next-auth/react'
// import React from 'react'

// const CompanyPage = () => {
//   const { data: session } = useSession()
//   const func = async () => {
//     if (session?.user.provider !== 'google') {
//       await signIn('google', { redirect: false })
//     }
//     postResource('/google/calendarAPI', [])
//   }
//   return <Button onClick={func}>test </Button>
// }

// export default CompanyPage

'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@src/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'
import { Button } from '@src/components/ui/button'
import { Progress } from '@src/components/ui/progress'
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'

// This would typically come from your database
const mockData = {
  team: {
    name: 'Mirage',
    totalProjects: 12,
    activeProjects: 8,
    totalTasks: 156,
    completedTasks: 89,
    members: [
      {
        name: 'Alice Cooper',
        role: 'Product Manager',
        avatar: '/placeholder.svg?height=32&width=32',
      },
      {
        name: 'Bob Wilson',
        role: 'Developer',
        avatar: '/placeholder.svg?height=32&width=32',
      },
      {
        name: 'Carol Smith',
        role: 'Designer',
        avatar: '/placeholder.svg?height=32&width=32',
      },
      {
        name: 'Dave Brown',
        role: 'Developer',
        avatar: '/placeholder.svg?height=32&width=32',
      },
    ],
    recentActivity: [
      { type: 'task', title: 'Update landing page', status: 'completed' },
      { type: 'project', title: 'Mobile App v2', status: 'in_progress' },
      { type: 'task', title: 'Fix navigation bug', status: 'in_progress' },
    ],
  },
}

export default function TeamDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mockData.team.name}
          </h1>
          <p className="text-muted-foreground">Team Overview</p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue="last-7-days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.team.totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockData.team.activeProjects} active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Task Completion
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (mockData.team.completedTasks / mockData.team.totalTasks) * 100,
              )}
              %
            </div>
            <Progress
              value={
                (mockData.team.completedTasks / mockData.team.totalTasks) * 100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.team.members.length}
            </div>
            <div className="flex -space-x-2 mt-2">
              {mockData.team.members.map((member, i) => (
                <Avatar key={i} className="border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">+12 tasks this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members and Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Active members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.team.members.map((member, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.team.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  {activity.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {activity.type} - {activity.status.replace('_', ' ')}
                    </p>
                  </div>
                  {activity.status === 'completed' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
