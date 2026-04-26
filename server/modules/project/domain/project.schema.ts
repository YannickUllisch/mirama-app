// server/modules/project/domain/project.schema.ts
//
// Single source of truth for shared Zod sub-schemas used by the create route,
// update route, and the client-side ProjectForm. Import from here — never
// redefine these inline.
import { z } from 'zod'

// ── Milestone ─────────────────────────────────────────────────────────────────
// Schema: Milestone { id String, date DateTime, title String, colors String, projectId }
// id is optional: present for existing milestones (edit flow), absent for new ones.
export const MilestoneSchema = z.object({
  id: z.string().optional(),
  date: z.coerce.date(),
  title: z.string().min(4),
  colors: z.string(),
})

// ── Tag ───────────────────────────────────────────────────────────────────────
// Schema: Tag { id String, title String, organizationId String }
export const NewTagSchema = z.object({
  title: z.string().min(2),
})

// ── Project relations ─────────────────────────────────────────────────────────
export const ProjectTeamLinkSchema = z.object({
  teamId: z.string().min(1),
})

// isManager is a UI hint only — the server resolves the actual IAM role from
// the member record and ignores this field during role assignment.
export const ProjectMemberLinkSchema = z.object({
  memberId: z.string().min(1),
  roleId: z.string().optional(),
})

// ── Inferred types ────────────────────────────────────────────────────────────
// Use these on the server (handlers, repo) and client instead of hand-writing
// the same shapes.
export type MilestoneInput = z.infer<typeof MilestoneSchema>
export type NewTag = z.infer<typeof NewTagSchema>
export type ProjectTeamLink = z.infer<typeof ProjectTeamLinkSchema>
export type ProjectMemberLink = z.infer<typeof ProjectMemberLinkSchema>
