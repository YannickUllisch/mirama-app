---
name: gortex-components-ui-23-dirs
description: "Work in the components/ui +23 dirs area — 312 symbols across 54 files (73% cohesion)"
---

# components/ui +23 dirs

312 symbols | 54 files | 73% cohesion

## When to Use

Use this skill when working on files in:
- `app/(app)/portal/_components/OrgPortalCard.tsx`
- `app/(app)/portal/_components/SecondaryPortalCard.tsx`
- `app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationCard.tsx`
- `app/(app)/tenant/[tenantId]/policies/_components/PoliciesManager.tsx`
- `app/(app)/tenant/[tenantId]/policies/_components/PolicyScopeTab.tsx`
- `app/(app)/tenant/[tenantId]/policies/page.tsx`
- `app/(app)/tenant/[tenantId]/roles/_components/IamPageNav.tsx`
- `app/(app)/tenant/[tenantId]/roles/_components/RolesManager.tsx`
- `app/(app)/tenant/[tenantId]/roles/_components/RolesScopeTab.tsx`
- `app/(app)/tenant/[tenantId]/roles/page.tsx`
- `app/(public)/(landing)/components/Hero/HeroBackground.tsx`
- `app/(public)/(landing)/components/Hero/HeroSection.tsx`
- `src/components/Calendar/calender-components/eventform.tsx`
- `src/components/Gantt/gantt.tsx`
- `src/components/InnerSidebar.tsx`
- `src/components/ProjectDashboard/TaskSidebar.tsx`
- `src/components/Tables/Cell/EditableCell.tsx`
- `src/components/Tables/DataTableToolbar.tsx`
- `src/components/Tables/Filters/DateRangeFilter.tsx`
- `src/components/Tree/TreeView.tsx`
- `src/components/data-grid/data-grid-column-header.tsx`
- `src/components/data-grid/data-grid-paste-dialog.tsx`
- `src/components/data-table/data-table-column-header.tsx`
- `src/components/data-table/data-table-toolbar.tsx`
- `src/components/data-table/data-table-view-options.tsx`
- `src/components/ui/action-bar.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/color-picker.tsx`
- `src/components/ui/combobox.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/faceted.tsx`
- `src/components/ui/input-otp.tsx`
- `src/components/ui/magicui/animated-gradient-text.tsx`
- `src/components/ui/magicui/marquee.tsx`
- `src/components/ui/magicui/shine-border.tsx`
- `src/components/ui/mention.tsx`
- `src/components/ui/phone-input.tsx`
- `src/components/ui/resizable.tsx`
- `src/components/ui/roadmap-ui/list.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/speed-dial.tsx`
- `src/components/ui/timeline.tsx`
- `src/lib/utils.ts`
- `src/modules/pm/tasks/components/TaskTypeIcons.tsx`
- `src/modules/shared/components/Background/Ribbon.tsx`
- `src/modules/shared/components/Background/SectionDivider.tsx`
- `src/modules/tenant/iam/components/SectionHeader.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `app/(app)/portal/_components/OrgPortalCard.tsx` | OrgPortalCard, initial |
| `app/(app)/portal/_components/SecondaryPortalCard.tsx` | SecondaryPortalCard |
| `app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationCard.tsx` | OrganizationCard, initial |
| `app/(app)/tenant/[tenantId]/policies/_components/PoliciesManager.tsx` | PoliciesManager |
| `app/(app)/tenant/[tenantId]/policies/_components/PolicyScopeTab.tsx` | Icon, deletePolicy, accentClass, PolicyScopeTab, label, ... |
| `app/(app)/tenant/[tenantId]/policies/page.tsx` | PoliciesPage |
| `app/(app)/tenant/[tenantId]/roles/_components/IamPageNav.tsx` | pathname, IamPageNav, tenantId |
| `app/(app)/tenant/[tenantId]/roles/_components/RolesManager.tsx` | RolesManager |
| `app/(app)/tenant/[tenantId]/roles/_components/RolesScopeTab.tsx` | items, router, Icon, deleteRole, label, ... |
| `app/(app)/tenant/[tenantId]/roles/page.tsx` | RolesPage |
| `app/(public)/(landing)/components/Hero/HeroBackground.tsx` | HeroBackground |
| `app/(public)/(landing)/components/Hero/HeroSection.tsx` | HeroSection |
| `src/components/Calendar/calender-components/eventform.tsx` | DeleteEvent |
| `src/components/Gantt/gantt.tsx` | event, GanttColumn, GanttFeatureDragHelper, setDragging, GanttFeature, ... |
| `src/components/InnerSidebar.tsx` | InnerSidebar, pathname |
| `src/components/ProjectDashboard/TaskSidebar.tsx` | TaskList |
| `src/components/Tables/Cell/EditableCell.tsx` | isDatePickerOpen, editValue, getDisplayText, handleKeyDown, EditableCell, ... |
| `src/components/Tables/DataTableToolbar.tsx` | hasActiveFilters, showFilters, setShowFilters, TData, DataTableToolbar |
| `src/components/Tables/Filters/DateRangeFilter.tsx` | from, label, TData, filterValue, formatDate, ... |
| `src/components/Tree/TreeView.tsx` | getTotalSize, width, getVirtualItems, TreeView, containerRef |
| `src/components/data-grid/data-grid-column-header.tsx` | onDoubleClick, DataGridColumnResizerImpl, defaultColumnDef, TData, TValue |
| `src/components/data-grid/data-grid-paste-dialog.tsx` | RadioItem |
| `src/components/data-table/data-table-column-header.tsx` | canHide, isPinned, DataTableColumnHeader, TValue, TData, ... |
| `src/components/data-table/data-table-toolbar.tsx` | columns, TData, onReset, DataTableToolbar, isFiltered |
| `src/components/data-table/data-table-view-options.tsx` | TData, columns, DataTableViewOptions |
| `src/components/ui/action-bar.tsx` | orientationProp, orientation, context, asChild, props, ... |
| `src/components/ui/alert-dialog.tsx` | AlertDialogFooter, AlertDialogHeader |
| `src/components/ui/breadcrumb.tsx` | BreadcrumbEllipsis, BreadcrumbSeparator |
| `src/components/ui/button.tsx` | buttonVariants |
| `src/components/ui/calendar.tsx` | defaultClassNames, Root, Calendar |
| `src/components/ui/chart.tsx` | ChartContainer, ChartLegendContent, ChartConfig, chartId, key, ... |
| `src/components/ui/color-picker.tsx` | ContentPrimitive, className, asChild, context, children, ... |
| `src/components/ui/combobox.tsx` | ComboboxLoading, Combobox, ComboboxInput, ComboboxSeparator, ComboboxGroupLabel, ... |
| `src/components/ui/command.tsx` | CommandShortcut |
| `src/components/ui/context-menu.tsx` | ContextMenuShortcut |
| `src/components/ui/drawer.tsx` | Drawer, DrawerFooter, DrawerHeader |
| `src/components/ui/dropdown-menu.tsx` | DropdownMenuShortcut |
| `src/components/ui/faceted.tsx` | props, props, FacetedItemProps, value, FacetedBadgeListProps, ... |
| `src/components/ui/input-otp.tsx` | InputOTPSlot, inputOTPContext, InputOTPGroup, char, InputOTP, ... |
| `src/components/ui/magicui/animated-gradient-text.tsx` | AnimatedGradientText |
| `src/components/ui/magicui/marquee.tsx` | Marquee |
| `src/components/ui/magicui/shine-border.tsx` | ShineBorder |
| `src/components/ui/mention.tsx` | MentionItem, Mention, MentionInput, MentionContent, MentionLabel |
| `src/components/ui/phone-input.tsx` | CountrySelect |
| `src/components/ui/resizable.tsx` | ResizableHandle, ResizablePanelGroup |
| `src/components/ui/roadmap-ui/list.tsx` | props, setNodeRef, attributes, transform, ListHeader, ... |
| `src/components/ui/sheet.tsx` | SheetFooter, SheetHeader |
| `src/components/ui/speed-dial.tsx` | LabelPrimitive, labelId, SpeedDialLabel |
| `src/components/ui/timeline.tsx` | TimelineDate, TimelineSeparator, TimelineContent, TimelineIndicator, TimelineHeader, ... |
| `src/lib/utils.ts` | cn, inputs |
| `src/modules/pm/tasks/components/TaskTypeIcons.tsx` | size, taskType, defaultStyling, getTaskTypeIcon |
| `src/modules/shared/components/Background/Ribbon.tsx` | animationClass, variants, MiramaRibbon |
| `src/modules/shared/components/Background/SectionDivider.tsx` | pathData, SectionDivider, accentOrigin, accentRotation |
| `src/modules/tenant/iam/components/SectionHeader.tsx` | style, SectionHeader |

## Entry Points

- `src/components/Tables/Cell/EditableCell.tsx::EditableCell`
- `src/components/ui/calendar.tsx::Calendar`

## Connected Communities

- **components/ui +97 dirs** (27 cross-edges)
- **components/ui +15 dirs** (18 cross-edges)
- **. +9 dirs** (4 cross-edges)
- **modules · optimisticList** (2 cross-edges)
- **. +1 dirs · GanttProvider** (1 cross-edges)
- **components · getState** (1 cross-edges)
- **. +1 dirs · ColorPickerImpl** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **components/ui +11 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-250"
smart_context with task: "understand components/ui +23 dirs", format: "gcx"
find_usages with id: "src/components/Tables/Cell/EditableCell.tsx::EditableCell", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
