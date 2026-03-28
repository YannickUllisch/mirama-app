'use client'

import type { ProjectResponse } from '@server/modules/project/features/response'
import { cn } from '@src/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {
  ArrowUpRight,
  Edit3,
  Flag,
  MoreHorizontal,
  Share2,
  ShieldCheck,
  Target,
  Trash2,
  Users,
} from 'lucide-react'
import HoverLink from '../HoverLink'

interface ProjectGridProps {
  projects: ProjectResponse[]
  loading: boolean
}

const ProjectGrid = ({ projects, loading }: ProjectGridProps) => {
  if (loading) return <ProjectGridSkeleton />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.slice(0, 4).map((project) => {
        const totalTasks = project.tasks?.length || 0
        const completedTasks =
          project.tasks?.filter((t) => t.status === 'DONE').length || 0
        const progressPercent =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        const isHighPriority = project.priority === 'HIGH'

        return (
          <div
            key={project.id}
            className="group relative flex flex-col justify-between p-5 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-tertiary/40 transition-all duration-300 shadow-sm"
          >
            {/* Top Row: Context & Action */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-tertiary text-base font-black shadow-sm group-hover:scale-105 transition-transform">
                  {project.name[0].toUpperCase()}
                </div>
                <div>
                  <HoverLink href={`/app/projects/${project.name}`}>
                    <h3 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-tertiary transition-colors flex items-center gap-1">
                      {project.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                  </HoverLink>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={cn(
                        'text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-md border',
                        isHighPriority
                          ? 'text-red-500 border-red-500/20 bg-red-500/5'
                          : 'text-neutral-400 border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50',
                      )}
                    >
                      {project.priority}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-1 text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors outline-none"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl font-bold tracking-tight"
                >
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-neutral-400">
                    Project Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" /> Quick
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                    <Users className="w-3.5 h-3.5 text-neutral-400" /> Manage
                    Team
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                    <Share2 className="w-3.5 h-3.5 text-neutral-400" /> Copy
                    Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2 text-xs">
                      <Flag className="w-3.5 h-3.5 text-neutral-400" /> Set
                      Priority
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="rounded-xl font-bold">
                        <DropdownMenuItem className="text-xs text-red-500">
                          High
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-tertiary">
                          Medium
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-neutral-400">
                          Low
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-xs text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-500/10">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Node
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mid: Description */}
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-6 font-medium">
              {project.description ||
                'Operational node active. Monitoring system parameters...'}
            </p>

            {/* Bottom: Metrics & Progress */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-tertiary" />
                    Integrity
                  </span>
                  <span className="text-tertiary">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="relative h-1.5 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(var(--tertiary-rgb),0.4)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center gap-1.5 text-neutral-400"
                    title="Milestones"
                  >
                    <Target className="w-3 h-3" />
                    <span className="text-[10px] font-black tracking-tighter">
                      {project.milestones.length}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-neutral-400"
                    title="Team"
                  >
                    <Users className="w-3 h-3" />
                    <span className="text-[10px] font-black tracking-tighter">
                      {project.members.length}
                    </span>
                  </div>
                </div>

                {/* Refined Avatar Stack */}
                <div className="flex -space-x-1.5">
                  {project.members.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="w-5 h-5 rounded-full border-[1.5px] border-white dark:border-[#0a0a0a] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[7px] font-black text-neutral-500"
                    >
                      {user.name[0]}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-white dark:border-[#0a0a0a] bg-secondary flex items-center justify-center text-[7px] font-black text-white">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const ProjectGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="h-52 bg-neutral-50 dark:bg-neutral-900/50 animate-pulse rounded-2xl border border-neutral-100 dark:border-neutral-800"
      />
    ))}
  </div>
)

export default ProjectGrid
