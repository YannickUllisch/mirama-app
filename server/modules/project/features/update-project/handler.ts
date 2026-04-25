// server/modules/project/features/update-project/handler.ts
import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectEntity } from '../../domain/project.entity'
import { resolveProjectRoster } from '../../domain/resolve-project-roster'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { UpdateProjectRequest } from './schema'

export const UpdateProjectCommand =
  ({ db }: AppContext) =>
  async (projectId: string, input: UpdateProjectRequest) => {
    const repo = ProjectRepository(db)

    // Check name uniqueness (exclude self)
    const existing = await repo.findByName(input.name)
    if (existing && existing.id !== projectId) {
      ProjectEntity.assertUniqueProjectName(existing)
    }

    const { tags, newTags, members, teams, milestones, ...proj } = input

    // ── Step 1: Parallel pre-work ────────────────────────────────────────────
    // Resolve the roster and pre-create any new tags concurrently.
    // New tags go through ScopedDb individually so organizationId is injected.
    const [{ memberRows, teamRows }, createdTags, projectData] =
      await Promise.all([
        resolveProjectRoster(db, { members, teams }),
        Promise.all(
          newTags.map((t) =>
            // organizationId is omitted here — ScopedDb injects it at runtime
            db.tag.create({
              data: { title: t.title } as {
                title: string
                organizationId: string
              },
              select: { id: true },
            }),
          ),
        ),
        db.project.findFirst({
          where: { id: projectId },
          select: { organizationId: true },
        }),
      ])

    const organizationId = projectData?.organizationId ?? ''
    const allTagIds = [...tags, ...createdTags.map((t) => t.id)]

    // ── Step 2: Update project core + tag set ────────────────────────────────
    await repo.updateCore(projectId, {
      ...proj,
      organizationId,
      tagIds: allTagIds,
    })

    // ── Step 3: Parallel relation replacements ───────────────────────────────
    // Members and teams are fully replaced; milestones are diffed (existing
    // ones updated, removed ones deleted, new ones created). All run within
    // the same transaction from withTransaction middleware.
    await Promise.all([
      repo.replaceMembers(projectId, memberRows),
      repo.replaceTeams(projectId, organizationId, teamRows),
      repo.syncMilestones(projectId, milestones),
    ])

    // ── Step 4: Return the fully populated project ───────────────────────────
    const project = await repo.findById(projectId)
    if (!project) throw new Error(`Project ${projectId} not found after update`)

    return toProjectResponse(project)
  }
