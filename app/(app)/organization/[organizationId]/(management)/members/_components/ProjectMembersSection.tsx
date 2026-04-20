import { Badge } from '@ui/badge'
import { FolderKanban } from 'lucide-react'
import type { ProjectWithMembers } from './types'

export const ProjectMembersSection = ({
  projects,
}: {
  projects: ProjectWithMembers[]
}) => {
  return (
    <>
      {projects.map((project) => (
        <section
          key={project.id}
          className="border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
            <FolderKanban className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-semibold">{project.name}</span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 ml-auto"
            >
              project members
            </Badge>
            <span className="text-xs text-muted-foreground">
              {project.members.length}
            </span>
          </div>
          <div className="divide-y divide-border/60">
            {project.members.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No members assigned to this project.
              </div>
            ) : (
              project.members.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between gap-4 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {pm.member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {pm.member.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ))}
    </>
  )
}
