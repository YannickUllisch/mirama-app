import { z } from 'zod'
import {
  ClientSummarySchema,
  ViewStateResponseSchema,
} from '../viewstate.types'

export const SidebarItemStateSchema = z.object({
  route: z.string().min(1),
  order: z.number().int(),
  visible: z.boolean().default(true),
  pinned: z.boolean().optional(),
})
export type SidebarItemState = z.infer<typeof SidebarItemStateSchema>

export const SidebarGroupStateSchema = z.object({
  group: z.string().min(1),
  order: z.number().int(),
  collapsed: z.boolean().optional(),
  visible: z.boolean().optional(),
  items: z.array(SidebarItemStateSchema),
})
export type SidebarGroupState = z.infer<typeof SidebarGroupStateSchema>

export const FavoriteEntityTypeSchema = z.enum(['client'])
export type FavoriteEntityType = z.infer<typeof FavoriteEntityTypeSchema>

export const FavoriteEntityStateSchema = z.object({
  type: FavoriteEntityTypeSchema,
  entityId: z.string().min(1),
  order: z.number().int(),
  color: z.string().optional(),
  icon: z.string().optional(),
  label: z.string().optional(),
})
export type FavoriteEntityState = z.infer<typeof FavoriteEntityStateSchema>

export const SidebarStateSchema = z.object({
  items: z.array(SidebarItemStateSchema).default([]),
  groups: z.array(SidebarGroupStateSchema).default([]),
  favorites: z
    .object({
      items: z.array(FavoriteEntityStateSchema),
    })
    .default({ items: [] }),
})
export type SidebarState = z.infer<typeof SidebarStateSchema>

export const SidebarBootstrapResponseSchema = z.object({
  sidebar: ViewStateResponseSchema,
  clients: z.array(ClientSummarySchema),
})
export type SidebarBootstrapResponse = z.infer<
  typeof SidebarBootstrapResponseSchema
>

export type ManifestRouteEntry<T> = T & { route?: string }

export type ResolvedSidebarItem<T> = T & {
  route: string
  order: number
  visible: boolean
  pinned?: boolean
}
