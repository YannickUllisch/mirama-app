'use client'
import { Badge } from '@src/components/ui/badge'
import { ClipboardCheck, Clock, MessageSquare, Users } from 'lucide-react'

export const LandingBentoBox = () => (
  <div className="w-full py-20 lg:py-40 bg-secondary">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge className="text-white">Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl text-text-inverted dark:text-text md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Everything you need to stay on track
            </h2>
            <p className="text-lg text-muted/60 dark:text-text/60 max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-left">
              From task automation to real-time collaboration, our platform
              keeps your team productive and focused.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-muted dark:bg-background rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <Users className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Team Collaboration</h3>
              <p className="text-text-secondary max-w-xs text-base">
                Work together seamlessly with shared tasks, real-time updates,
                and streamlined workflows.
              </p>
            </div>
          </div>
          <div className="bg-muted dark:bg-background  rounded-md aspect-square p-6 flex justify-between flex-col">
            <ClipboardCheck className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Task Automation</h3>
              <p className="text-text-secondary  max-w-xs text-base">
                Automate repetitive tasks and focus on what really matters.
              </p>
            </div>
          </div>
          <div className="bg-muted dark:bg-background  rounded-md aspect-square p-6 flex justify-between flex-col">
            <Clock className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Time Tracking</h3>
              <p className="text-text-secondary max-w-xs text-base">
                Stay on schedule with built-in time tracking and progress
                insights.
              </p>
            </div>
          </div>
          <div className="bg-muted dark:bg-background rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <MessageSquare className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Seamless Communication</h3>
              <p className="text-text-secondary max-w-xs text-base">
                Chat, comment, and stay connected with your team in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
