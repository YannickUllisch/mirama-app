import type {
  ManifestRouteEntry,
  ResolvedSidebarItem,
  SidebarItemState,
  SidebarState,
} from './sidebar.types'
import { SidebarStateSchema } from './sidebar.types'

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

export const mergeAllSidebarItems = <T>(
  manifestItems: ManifestRouteEntry<T>[],
  stateItems: SidebarItemState[],
): ResolvedSidebarItem<T>[] => {
  const stateByRoute = new Map(stateItems.map((item) => [item.route, item]))

  return manifestItems
    .filter((manifestItem): manifestItem is T & { route: string } =>
      Boolean(manifestItem.route),
    )
    .map((manifestItem, index) => {
      const saved = stateByRoute.get(manifestItem.route)
      return {
        ...manifestItem,
        order: saved?.order ?? 1_000 + index,
        visible: saved?.visible ?? true,
        pinned: saved?.pinned,
      }
    })
    .sort((a, b) => a.order - b.order)
}

export const mergeSidebarItems = <T>(
  manifestItems: ManifestRouteEntry<T>[],
  stateItems: SidebarItemState[],
): ResolvedSidebarItem<T>[] =>
  mergeAllSidebarItems(manifestItems, stateItems).filter((item) => item.visible)

export const toItemState = (
  item: ResolvedSidebarItem<unknown>,
): SidebarItemState => ({
  route: item.route,
  order: item.order,
  visible: item.visible,
  pinned: item.pinned,
})

const upsertItemState = (
  items: SidebarItemState[],
  route: string,
  patch: Partial<Omit<SidebarItemState, 'route'>>,
): SidebarItemState[] =>
  items.some((item) => item.route === route)
    ? items.map((item) => (item.route === route ? { ...item, ...patch } : item))
    : [...items, { route, order: items.length, visible: true, ...patch }]

export const setItemVisibility = (
  state: SidebarState,
  route: string,
  visible: boolean,
): SidebarState => ({
  ...state,
  items: upsertItemState(state.items, route, { visible }),
})

export const setGroupItemVisibility = (
  state: SidebarState,
  group: string,
  route: string,
  visible: boolean,
): SidebarState => ({
  ...state,
  groups: state.groups.map((g) =>
    g.group === group
      ? { ...g, items: upsertItemState(g.items, route, { visible }) }
      : g,
  ),
})

export const setGroupVisibility = (
  state: SidebarState,
  group: string,
  visible: boolean,
): SidebarState => ({
  ...state,
  groups: state.groups.map((g) => (g.group === group ? { ...g, visible } : g)),
})

export const moveOrderedItem = <T extends { order: number }>(
  items: T[],
  index: number,
  direction: -1 | 1,
): T[] => {
  const sorted = [...items].sort((a, b) => a.order - b.order)
  const target = index + direction
  if (target < 0 || target >= sorted.length) return items
  const orders = sorted.map((item) => item.order)
  ;[orders[index], orders[target]] = [orders[target], orders[index]]
  return sorted.map((item, i) => ({ ...item, order: orders[i] }))
}
