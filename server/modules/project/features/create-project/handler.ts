// server/modules/project/features/create-project/handler.ts
import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectEntity } from '../../domain/project.entity'
import { resolveProjectRoster } from '../../domain/resolve-project-roster'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { CreateProjectRequest } from './schema'

export const CreateProjectCommand =
  ({ db }: AppContext) =>
  async (
    input: CreateProjectRequest,
    organizationId: string,
    creatorEmail: string,
  ) => {
    const repo = ProjectRepository(db)

    const existing = await repo.findByName(input.name)
    ProjectEntity.assertUniqueProjectName(existing)

    const { tags, newTags, members, teams, newMilestones, ...proj } = input

    // ── Step 1: Parallel pre-work ────────────────────────────────────────────
    // Resolve the creator, the member/team roster, and pre-create any new tags
    // concurrently. New tags are created as top-level ScopedDb calls so that
    // organizationId gets injected correctly, and we get back real IDs to
    // connect to the project.
    const [creator, { memberRows, teamRows }, createdTags] = await Promise.all([
      db.member.findFirst({
        where: { email: creatorEmail },
        select: { id: true, iamRoleId: true },
      }),
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
    ])

    // Inject creator into the roster now that we have their id
    if (creator) {
      const alreadyCovered = memberRows.some((m) => m.memberId === creator.id)
      if (!alreadyCovered) {
        memberRows.push({
          memberId: creator.id,
          roleId: creator.iamRoleId,
          isInherited: false,
        })
      }
    }

    const allTagIds = [...tags, ...createdTags.map((t) => t.id)]

    // ── Step 2: Create the project core ──────────────────────────────────────
    // Tags are connected by ID only — no nested creates. Milestones, members,
    // and teams are written separately so ScopedDb handles each model correctly.
    const { id: projectId } = await repo.create({
      ...proj,
      organizationId,
      tagIds: allTagIds,
    })

    // ── Step 3: Parallel post-writes ─────────────────────────────────────────
    // All three operations run concurrently within the same transaction
    // (provided by withTransaction middleware).
    await Promise.all([
      repo.addMembers(projectId, memberRows),
      repo.addTeams(projectId, organizationId, teamRows),
      repo.addMilestones(projectId, newMilestones),
    ])

    // ── Step 4: Return the fully populated project ───────────────────────────
    const project = await repo.findById(projectId)
    if (!project) throw new Error(`Project ${projectId} not found after create`)

    return toProjectResponse(project)
  }
