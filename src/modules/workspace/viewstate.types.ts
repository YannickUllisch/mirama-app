import { z } from 'zod'

// Mirrors Mirama.Modules.Workspace.Domain.Aggregates.ViewState.ViewType.
// Adding a new customizable surface (another table, another board layout) means
// adding a new value here plus a typed StateJson shape below - never a migration.
export const ViewTypeSchema = z.enum(['Sidebar', 'Table', 'KanbanBoard', 'Gantt'])
export type ViewType = z.infer<typeof ViewTypeSchema>

export const ViewStateResponseSchema = z.object({
  id: z.uuid(),
  surfaceKey: z.string(),
  viewType: ViewTypeSchema,
  stateJson: z.string(),
  lastModified: z.coerce.date().nullable().optional(),
})
export type ViewStateResponse = z.infer<typeof ViewStateResponseSchema>

// Full-state replace (PUT), not a per-field PATCH - matches SaveViewStateCommand on the
// backend. Callers debounce rapid client-side changes (a drag, a column reorder) and send
// one replacement rather than one request per intermediate state.
export const SaveViewStateSchema = z.object({
  surfaceKey: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-zA-Z0-9:_-]+$/, {
      message: "Surface key may only contain letters, digits, ':', '_' and '-'.",
    }),
  viewType: ViewTypeSchema,
  stateJson: z.string().min(1).max(65_536),
})
export type SaveViewStateCommand = z.infer<typeof SaveViewStateSchema>

// ---------------------------------------------------------------------------
// Sidebar StateJson shape (ViewType.Sidebar)
//
// StateJson is an opaque string on the wire - the backend only validates its size and
// leaves the shape to the frontend. This is the shape we've settled on for the
// personalized sidebar: a group holds an ordered list of items, each pointing at a route
// from the static nav manifest, plus per-item visibility/order/pin overrides. Extra fields
// (defaultRoute, density) ride along on the same StateJson with no backend changes needed.
// ---------------------------------------------------------------------------

export const SidebarItemStateSchema = z.object({
  // Stable key of the underlying route entry from the static menu manifest
  // (e.g. organizationSidebarMenu / settingsSidebarMenu) - never the raw href alone,
  // so a renamed href doesn't orphan a user's saved customization.
  route: z.string().min(1),
  href: z.string().min(1),
  order: z.number().int(),
  visible: z.boolean().default(true),
  pinned: z.boolean().optional(),
})
export type SidebarItemState = z.infer<typeof SidebarItemStateSchema>

export const SidebarGroupStateSchema = z.object({
  group: z.string().min(1),
  order: z.number().int(),
  collapsed: z.boolean().optional(),
  items: z.array(SidebarItemStateSchema),
})
export type SidebarGroupState = z.infer<typeof SidebarGroupStateSchema>

export const SidebarStateSchema = z.object({
  groups: z.array(SidebarGroupStateSchema),
  // Route to land on after login / when clicking the workspace logo.
  defaultRoute: z.string().optional(),
  density: z.enum(['comfortable', 'compact']).optional(),
})
export type SidebarState = z.infer<typeof SidebarStateSchema>

// Defensive by design: a malformed or stale StateJson (e.g. saved by an older client
// version) should fall back to the default sidebar, never crash the shell.
export const parseSidebarState = (stateJson: string): SidebarState | null => {
  try {
    const parsed = SidebarStateSchema.safeParse(JSON.parse(stateJson))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export const serializeSidebarState = (state: SidebarState): string =>
  JSON.stringify(SidebarStateSchema.parse(state))
