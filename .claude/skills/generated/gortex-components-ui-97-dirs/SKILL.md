---
name: gortex-components-ui-97-dirs
description: "Work in the components/ui +97 dirs area — 1167 symbols across 181 files (83% cohesion)"
---

# components/ui +97 dirs

1167 symbols | 181 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/(app)/organization/[organizationId]/(management)/members/_components/MembersContent.tsx`
- `app/(app)/organization/[organizationId]/(management)/members/_components/OrgMembersColumns.tsx`
- `app/(app)/organization/[organizationId]/(management)/members/_components/ProjectMembersColumns.tsx`
- `app/(app)/organization/[organizationId]/(management)/members/layout.tsx`
- `app/(app)/organization/[organizationId]/(management)/members/page.tsx`
- `app/(app)/organization/[organizationId]/page.tsx`
- `app/(app)/organization/[organizationId]/projects/[name]/create/[type]/page.tsx`
- `app/(app)/organization/[organizationId]/projects/[name]/edit/[id]/page.tsx`
- `app/(app)/organization/[organizationId]/projects/[name]/page.tsx`
- `app/(app)/organization/[organizationId]/projects/_components/ArchivedProjectsColumns.tsx`
- `app/(app)/organization/[organizationId]/projects/_components/ProjectsContent.tsx`
- `app/(app)/organization/[organizationId]/projects/columns.tsx`
- `app/(app)/organization/[organizationId]/projects/create/page.tsx`
- `app/(app)/organization/[organizationId]/projects/edit/[id]/page.tsx`
- `app/(app)/organization/[organizationId]/settings/page.tsx`
- `app/(app)/organization/[organizationId]/tasks/page.tsx`
- `app/(app)/tenant/[tenantId]/(dashboard)/_components/InvitationPanel.tsx`
- `app/(app)/tenant/[tenantId]/billing/_components/PlanCard.tsx`
- `app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSection.tsx`
- `app/(app)/tenant/[tenantId]/billing/_components/UsageSection.tsx`
- `app/(app)/tenant/[tenantId]/billing/_components/billing-helpers.ts`
- `app/(app)/tenant/[tenantId]/billing/page.tsx`
- `app/(app)/tenant/[tenantId]/billing/plans/_components/PlansGrid.tsx`
- `app/(app)/tenant/[tenantId]/billing/plans/page.tsx`
- `app/(app)/tenant/[tenantId]/organization/[orgId]/edit/page.tsx`
- `app/(app)/tenant/[tenantId]/organization/_components/OrganizationForm.tsx`
- `app/(app)/tenant/[tenantId]/organization/create/page.tsx`
- `app/(app)/tenant/[tenantId]/policies/_components/PolicyColumns.tsx`
- `app/(app)/tenant/[tenantId]/policies/create/page.tsx`
- `app/(app)/tenant/[tenantId]/roles/_components/RoleColumns.tsx`
- `app/(app)/tenant/[tenantId]/settings/branding/page.tsx`
- `app/(public)/(landing)/components/CallToAction.tsx`
- `app/(public)/(landing)/components/FeaturesShowcase.tsx`
- `app/(public)/(landing)/components/Hero/HeroScreenWidget.tsx`
- `app/(public)/(landing)/components/Hero/HeroTextElements.tsx`
- `app/(public)/(landing)/components/Modern/ModernBento.tsx`
- `app/(public)/(landing)/components/Modern/ModernHero.tsx`
- `app/(public)/(landing)/components/StrategicSection.tsx`
- `app/(public)/(landing)/page.tsx`
- `app/(public)/about/page.tsx`
- `app/(public)/contact/page.tsx`
- `app/(public)/cookies/page.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/privacy/page.tsx`
- `app/(public)/termsofservice/page.tsx`
- `app/auth/forgot-password/page.tsx`
- `app/auth/login/page.tsx`
- `app/auth/register/page.tsx`
- `app/auth/set-password/page.tsx`
- `app/auth/verify/page.tsx`
- `app/loading.tsx`
- `app/not-found.tsx`
- `app/unauthorized.tsx`
- `prisma/generated/client/index.d.ts`
- `prisma/generated/client/runtime/client.d.ts`
- `server/modules/task/domain/task.entity.ts`
- `server/modules/task/features/comments/comment.repo.ts`
- `server/modules/task/features/comments/handler.ts`
- `server/modules/task/features/create-task/handler.ts`
- `server/modules/task/features/create-task/schema.ts`
- `server/modules/task/features/delete-task/handler.ts`
- `server/modules/task/features/get-task/handler.ts`
- `server/modules/task/features/get-tasks/handler.ts`
- `server/modules/task/features/response.ts`
- `server/modules/task/features/update-task/handler.ts`
- `server/modules/task/features/update-task/schema.ts`
- `server/modules/task/infrastructure/task.repo.ts`
- `server/shared/utils/logger.ts`
- `src/components/(application)/core/Avatar/AvatarGroup.tsx`
- `src/components/(application)/core/Avatar/UserAvatar.tsx`
- `src/components/(application)/core/Buttons/ClearButton.tsx`
- `src/components/(application)/core/Inputs/EditableCell.tsx`
- `src/components/(application)/project/Contexts/ProjectDataContext.tsx`
- `src/components/(application)/task/comments/CommentUI.tsx`
- `src/components/Calendar/calender-components/combobox.tsx`
- `src/components/Calendar/calender-components/eventform.tsx`
- `src/components/Calendar/calender-components/monthview.tsx`
- `src/components/Calendar/calender-components/weekview.tsx`
- `src/components/Calendar/event-components/yearviewlist.tsx`
- `src/components/Calendar/helpers/week-render.tsx`
- `src/components/Cards/ProjectCard.tsx`
- `src/components/Dialogs/AddSubtaskDialog.tsx`
- `src/components/Dialogs/ConfirmationDialog.tsx`
- `src/components/Gantt/ViewOptions.tsx`
- `src/components/Gantt/gantt.tsx`
- `src/components/GeneralAccordion.tsx`
- `src/components/GeneralTooltip.tsx`
- `src/components/Header/HeaderBreadcrumbs.tsx`
- `src/components/Header/HeaderProfile.tsx`
- `src/components/Header/ModernPublicHeader.tsx`
- `src/components/Header/ProjectHeader.tsx`
- `src/components/Header/PublicHeader.tsx`
- `src/components/HoverLink.tsx`
- `src/components/Kanban/KanbanBoard.tsx`
- `src/components/Kanban/KanbanContainerItem.tsx`
- `src/components/Kanban/KanbanHeader.tsx`
- `src/components/Kanban/KanbanItem.tsx`
- `src/components/MiramaIcon.tsx`
- `src/components/PageHeader.tsx`
- `src/components/ProjectDashboard/MetricCard.tsx`
- `src/components/ProjectDashboard/ProjectGrid.tsx`
- `src/components/ProjectDashboard/TaskSidebar.tsx`
- `src/components/ProjectDashboard/TimelineCard.tsx`
- `src/components/Select/CalendarSelect.tsx`
- `src/components/Select/GeneralSelect.tsx`
- `src/components/Select/GeneralTableSelect.tsx`
- `src/components/Select/UserMultiSelect.tsx`
- `src/components/Sidebar/MainNav.tsx`
- `src/components/Sidebar/OrganizationSidebar.tsx`
- `src/components/Sidebar/SidebarMobileHeader.tsx`
- `src/components/Sidebar/SidebarNewButton.tsx`
- `src/components/Sidebar/SidebarProjectsList.tsx`
- `src/components/Sidebar/TenantSidebar.tsx`
- `src/components/Tables/ColumnHeader.tsx`
- `src/components/Tables/DataTableContent.tsx`
- `src/components/Tables/DataTableHeader.tsx`
- `src/components/Tables/Filters/BasicFilterModel.tsx`
- `src/components/Tables/Filters/FacetedFilter.tsx`
- `src/components/Tables/Filters/FilterBar.tsx`
- `src/components/Tables/Toolbar/ToolbarViewOptions.tsx`
- `src/components/Tabs/ProjectTabs/BoardTab.tsx`
- `src/components/Tabs/ProjectTabs/ListTab.tsx`
- `src/components/Tabs/ProjectTabs/OverviewTab.tsx`
- `src/components/Tabs/ProjectTabs/TableTab.tsx`
- `src/components/Tabs/ProjectTabs/TimelineTab.tsx`
- `src/components/Tabs/ProjectTabs/helper/ListTabColumns.tsx`
- `src/components/Tabs/SettingTabs/AccountTab.tsx`
- `src/components/Tabs/SettingTabs/helper/InvitationsTabColumns.tsx`
- `src/components/Tabs/SettingTabs/helper/TagTabColumns.tsx`
- `src/components/Tabs/ViewTaskTabs/CommentTab.tsx`
- `src/components/Tabs/ViewTaskTabs/RelatedWorkTab.tsx`
- `src/components/Tabs/ViewTaskTabs/TimelineTab.tsx`
- `src/components/Task/CheckboxTaskList.tsx`
- `src/components/Task/SubTasksGroup.tsx`
- `src/components/Task/TaskContextContent.tsx`
- `src/components/Task/TaskTree.tsx`
- `src/components/Task/TaskTypeCreate.tsx`
- `src/components/Task/ViewTaskSheet.tsx`
- `src/components/Widgets/MinimalistTasksWidget.tsx`
- `src/components/Widgets/MyTasksWidget.tsx`
- `src/components/Widgets/ProjectsTimelineWidget.tsx`
- `src/components/Widgets/RecentProjectsWidget.tsx`
- `src/components/auth/ContactForm.tsx`
- `src/components/data-table/data-table.tsx`
- `src/components/ui/action-bar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/centering.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/color-picker.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/mask-input.tsx`
- `src/components/ui/time-picker.tsx`
- `src/lib/createTree.tsx`
- `src/lib/data-grid.ts`
- `src/lib/data-table.ts`
- `src/lib/utils.ts`
- `src/modules/pm/projects/components/CreateProjectForm.tsx`
- `src/modules/pm/projects/components/EditProjectForm.tsx`
- `src/modules/pm/projects/components/ProjectForm.tsx`
- `src/modules/pm/projects/projects.helpers.ts`
- `src/modules/pm/projects/projects.types.ts`
- `src/modules/pm/tasks/components/TaskTypeHelpers.ts`
- `src/modules/pm/tasks/tasks.api.ts`
- `src/modules/pm/tasks/tasks.hooks.ts`
- `src/modules/shared/components/Background/GridDecoration.tsx`
- `src/modules/shared/components/Footer/Footer.tsx`
- `src/modules/shared/components/Footer/ModernPublicFooter.tsx`
- `src/modules/shared/components/ReturnLink.tsx`
- `src/modules/shared/hooks/utils/useEditableColumns.ts`
- `src/modules/shared/hooks/utils/useLocalStorage.ts`
- `src/modules/tenant/iam/PermissionContext.tsx`
- `src/modules/tenant/iam/components/EffectBadge.tsx`
- `src/modules/tenant/iam/components/MemberAccessTab.tsx`
- `src/modules/tenant/iam/components/PermissionAccordion.tsx`
- `src/modules/tenant/iam/iam.types.ts`
- `src/modules/tenant/iam/policy/components/PolicyForm.tsx`
- `src/modules/tenant/iam/policy/components/PolicyRow.tsx`
- `src/modules/tenant/iam/policy/policy.types.ts`
- `src/modules/tenant/iam/roles/components/RoleForm.tsx`
- `src/types/types.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | filter, endsWith, map, pop, info, ... |
| `app/(app)/organization/[organizationId]/(management)/members/_components/MembersContent.tsx` | orgColumns, handleOrgRoleChange, members, MembersContent, projectColumns, ... |
| `app/(app)/organization/[organizationId]/(management)/members/_components/OrgMembersColumns.tsx` | useOrgMemberColumns |
| `app/(app)/organization/[organizationId]/(management)/members/_components/ProjectMembersColumns.tsx` | ProjectMemberRow, useProjectMemberColumns |
| `app/(app)/organization/[organizationId]/(management)/members/layout.tsx` | Layout |
| `app/(app)/organization/[organizationId]/(management)/members/page.tsx` | MembersPage |
| `app/(app)/organization/[organizationId]/page.tsx` | tasks, isTasksLoading, session, projects, isProjectsLoading, ... |
| `app/(app)/organization/[organizationId]/projects/[name]/create/[type]/page.tsx` | isPending, form, onSubmit, users, params, ... |
| `app/(app)/organization/[organizationId]/projects/[name]/edit/[id]/page.tsx` | tasks, tags, router, users, updateTaskMutation, ... |
| `app/(app)/organization/[organizationId]/projects/[name]/page.tsx` | searchParams, setRecentProjects, hasStoredProject, tab, users, ... |
| `app/(app)/organization/[organizationId]/projects/_components/ArchivedProjectsColumns.tsx` | _props, menuOpen, ArchivedActionsCell, useArchivedProjectsColumns, setMenuOpen, ... |
| `app/(app)/organization/[organizationId]/projects/_components/ProjectsContent.tsx` | archiveMutation, StatCard, activeColumns, archivedColumns, activeList, ... |
| `app/(app)/organization/[organizationId]/projects/columns.tsx` | activeOrganizationId, useProjectColumns, canUpdate, ActionsCell, canDelete, ... |
| `app/(app)/organization/[organizationId]/projects/create/page.tsx` | CreateProjectPage |
| `app/(app)/organization/[organizationId]/projects/edit/[id]/page.tsx` | EditProjectPage, id |
| `app/(app)/organization/[organizationId]/settings/page.tsx` | currentTab, settingsTabs, searchParams, pathname, router, ... |
| `app/(app)/organization/[organizationId]/tasks/page.tsx` | completedTasks, handleTaskUpdate, todayTasks, overdueTasks, task, ... |
| `app/(app)/tenant/[tenantId]/(dashboard)/_components/InvitationPanel.tsx` | isError, invitations, InvitationPanel, activeInvitations |
| `app/(app)/tenant/[tenantId]/billing/_components/PlanCard.tsx` | PlanCard |
| `app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSection.tsx` | SubscriptionSection, sub, isLoading, stats, tenant, ... |
| `app/(app)/tenant/[tenantId]/billing/_components/UsageSection.tsx` | isLoading, rows, UsageSection, usage |
| `app/(app)/tenant/[tenantId]/billing/_components/billing-helpers.ts` | fmtDate, fmtPrice, cents, d |
| `app/(app)/tenant/[tenantId]/billing/page.tsx` | BillingPage |
| `app/(app)/tenant/[tenantId]/billing/plans/_components/PlansGrid.tsx` | currentPlanId, isLoading, PlansGrid, tenant, plans |
| `app/(app)/tenant/[tenantId]/billing/plans/page.tsx` | PlansPage |
| `app/(app)/tenant/[tenantId]/organization/[orgId]/edit/page.tsx` | tenantId, orgId, EditOrganizationPage |
| `app/(app)/tenant/[tenantId]/organization/_components/OrganizationForm.tsx` | isEditing, org, createOrganization, startTransition, handleSubmit, ... |
| `app/(app)/tenant/[tenantId]/organization/create/page.tsx` | tenantId, CreateOrganizationPage |
| `app/(app)/tenant/[tenantId]/policies/_components/PolicyColumns.tsx` | usePolicyColumns |
| `app/(app)/tenant/[tenantId]/policies/create/page.tsx` | defaultScope, CreatePolicyPage |
| `app/(app)/tenant/[tenantId]/roles/_components/RoleColumns.tsx` | useRoleColumns |
| `app/(app)/tenant/[tenantId]/settings/branding/page.tsx` | form, BrandingPage, dropzone, isLoading |
| `app/(public)/(landing)/components/CallToAction.tsx` | CallToAction, benefits |
| `app/(public)/(landing)/components/FeaturesShowcase.tsx` | FeaturesShowcase |
| `app/(public)/(landing)/components/Hero/HeroScreenWidget.tsx` | HeroScreenWidget |
| `app/(public)/(landing)/components/Hero/HeroTextElements.tsx` | HeroTextElements |
| `app/(public)/(landing)/components/Modern/ModernBento.tsx` | LandingBentoBox |
| `app/(public)/(landing)/components/Modern/ModernHero.tsx` | ModernHero |
| `app/(public)/(landing)/components/StrategicSection.tsx` | specs, StrategicOverview |
| `app/(public)/(landing)/page.tsx` | LandingPage |
| `app/(public)/about/page.tsx` | AboutUsPage |
| `app/(public)/contact/page.tsx` | ContactPage |
| `app/(public)/cookies/page.tsx` | CookiePolicy |
| `app/(public)/layout.tsx` | session, Layout |
| `app/(public)/privacy/page.tsx` | dataNodes, lastUpdated, PrivacyPolicy |
| `app/(public)/termsofservice/page.tsx` | clauses, lastUpdated, TermsOfServicesPage |
| `app/auth/forgot-password/page.tsx` | ForgotPasswordPage |
| `app/auth/login/page.tsx` | LoginPage |
| `app/auth/register/page.tsx` | RegisterPage |
| `app/auth/set-password/page.tsx` | SetPasswordPage |
| `app/auth/verify/page.tsx` | VerifyPage |
| `app/loading.tsx` | Loading |
| `app/not-found.tsx` | session, NotFoundPage, isAuthenticated |
| `app/unauthorized.tsx` | UnauthorizedPage, isAuthenticated, session |
| `prisma/generated/client/index.d.ts` | Milestone, Task |
| `prisma/generated/client/runtime/client.d.ts` | Link, UnwrapPayload, Select |
| `server/modules/task/domain/task.entity.ts` | prefix, normalized, memberIds, hash, generateTaskId, ... |
| `server/modules/task/features/comments/comment.repo.ts` | findByTaskId, taskId |
| `server/modules/task/features/comments/handler.ts` | GetCommentsQuery |
| `server/modules/task/features/create-task/handler.ts` | CreateTaskCommand |
| `server/modules/task/features/create-task/schema.ts` | CreateTaskRequest |
| `server/modules/task/features/delete-task/handler.ts` | DeleteTasksBulkCommand, DeleteTaskCommand |
| `server/modules/task/features/get-task/handler.ts` | GetTaskQuery |
| `server/modules/task/features/get-tasks/handler.ts` | GetPersonalTasksQuery, GetTasksByProjectQuery |
| `server/modules/task/features/response.ts` | t, input, toSimpleTask, toTaskResponse |
| `server/modules/task/features/update-task/handler.ts` | UpdateTaskCommand |
| `server/modules/task/features/update-task/schema.ts` | UpdateTaskRequest |
| `server/modules/task/infrastructure/task.repo.ts` | findByProject, data, update, id, ids, ... |
| `server/shared/utils/logger.ts` | label, formatters.level |
| `src/components/(application)/core/Avatar/AvatarGroup.tsx` | AvatarGroupProps, AvatarGroup, remainingUsersCount, shownUsers |
| `src/components/(application)/core/Avatar/UserAvatar.tsx` | UserAvatarProps, UserAvatar, userColor |
| `src/components/(application)/core/Buttons/ClearButton.tsx` | ClearButton |
| `src/components/(application)/core/Inputs/EditableCell.tsx` | EditableCellProps, onBlur, value, onBlur, setValue, ... |
| `src/components/(application)/project/Contexts/ProjectDataContext.tsx` | ProjectDataContext |
| `src/components/(application)/task/comments/CommentUI.tsx` | CommentUI, showReplyBox, setShowReplyBox |
| `src/components/Calendar/calender-components/combobox.tsx` | Combobox, setOpen, open |
| `src/components/Calendar/calender-components/eventform.tsx` | values, form, error, EventForm, onSubmit |
| `src/components/Calendar/calender-components/monthview.tsx` | firstDayIndex, reorderedDaysOfWeek, startDay, startWeek, MonthView |
| `src/components/Calendar/calender-components/weekview.tsx` | eventsWithOverlap, isTodaysDate, dayInTheMonth, dayEvents, AllDayEventsView, ... |
| `src/components/Calendar/event-components/yearviewlist.tsx` | props, Eventyearviewbtn |
| `src/components/Calendar/helpers/week-render.tsx` | renderDaysOfWeek |
| `src/components/Cards/ProjectCard.tsx` | ProjectCard |
| `src/components/Dialogs/AddSubtaskDialog.tsx` | selectedTaskId, AddSubtaskdialogProps, AddSubtaskDialog, LinkSubtask, setSelectedTaskId, ... |
| `src/components/Dialogs/ConfirmationDialog.tsx` | ConfirmationDialog |
| `src/components/Gantt/ViewOptions.tsx` | handleZoomIn, handleZoomOut, handleZoomIn, handleZoomOut, ViewControls |
| `src/components/Gantt/gantt.tsx` | gantt, gantt, QuarterlyHeader, GanttFeatureListGroup, GanttContentHeader, ... |
| `src/components/GeneralAccordion.tsx` | GeneralAccordion |
| `src/components/GeneralTooltip.tsx` | GeneralTooltip, ToolTipProps |
| `src/components/Header/HeaderBreadcrumbs.tsx` | HeaderBreadcrumbs, pathname, pathSegments, accumulatedPaths |
| `src/components/Header/HeaderProfile.tsx` | HeaderProfile, theme, setTheme, session |
| `src/components/Header/ModernPublicHeader.tsx` | ModernPublicHeader |
| `src/components/Header/ProjectHeader.tsx` | ProjectHeader, HeaderInterface |
| `src/components/Header/PublicHeader.tsx` | PublicHeader |
| `src/components/HoverLink.tsx` | handleMouseEnter, prefetched, HoverLink, router, Props, ... |
| `src/components/Kanban/KanbanBoard.tsx` | itemStatus, handleDragStart, newTask, over, active, ... |
| `src/components/Kanban/KanbanContainerItem.tsx` | isOpen, setIsOpen, ContainerHeaderProps, ContainerHeader |
| `src/components/Kanban/KanbanHeader.tsx` | KanbanHeader |
| `src/components/Kanban/KanbanItem.tsx` | isDragging, setNodeRef, attributes, transform, KanbanItem, ... |
| `src/components/MiramaIcon.tsx` | MiramaIcon |
| `src/components/PageHeader.tsx` | PageHeader |
| `src/components/ProjectDashboard/MetricCard.tsx` | MetricCard |
| `src/components/ProjectDashboard/ProjectGrid.tsx` | ProjectGridSkeleton, ProjectGrid |
| `src/components/ProjectDashboard/TaskSidebar.tsx` | activeTasks, setUpdatingTaskId, updatingTaskId, MinimalistTasksWidget, TaskSkeleton, ... |
| `src/components/ProjectDashboard/TimelineCard.tsx` | TimelineCard, timelineStart, timelineEnd, daysToShow, viewDate, ... |
| `src/components/Select/CalendarSelect.tsx` | popupOpen, CalendarSelectProps, setPopupOpen, CalendarSelect |
| `src/components/Select/GeneralSelect.tsx` | GeneralSelect, GeneralSelectProps |
| `src/components/Select/GeneralTableSelect.tsx` | GeneralTableSelect, onValueChange, onValueChange, GeneralTableSelectProps, _val |
| `src/components/Select/UserMultiSelect.tsx` | UserMultiSelectProps, UserMultiSelect, selectedUserIds, setSelectedUserIds, users |
| `src/components/Sidebar/MainNav.tsx` | MainNavProps, SidebarMainNav, hasPermission, pathname |
| `src/components/Sidebar/OrganizationSidebar.tsx` | items, localizedMenu, injectOrgId, organizationId, session, ... |
| `src/components/Sidebar/SidebarMobileHeader.tsx` | SidebarMobileHeader, isMobile |
| `src/components/Sidebar/SidebarNewButton.tsx` | SidebarNewButton |
| `src/components/Sidebar/SidebarProjectsList.tsx` | canCreate, visible, can, pathname, setOpen, ... |
| `src/components/Sidebar/TenantSidebar.tsx` | buildTenantMenu, localizedMenu, TenantSidebar, tenantId |
| `src/components/Tables/ColumnHeader.tsx` | TValue, DataTableColumnHeader, TData |
| `src/components/Tables/DataTableContent.tsx` | TData, DataTableContent, TValue |
| `src/components/Tables/DataTableHeader.tsx` | handleScroll, TData, headerRef, isSticky, setIsSticky, ... |
| `src/components/Tables/Filters/BasicFilterModel.tsx` | TData, BasicFilterModel, isFiltered |
| `src/components/Tables/Filters/FacetedFilter.tsx` | TValue, facets, DataTableFacetedFilter, TData, selectedValues |
| `src/components/Tables/Filters/FilterBar.tsx` | filterableColumns, FilterBar, hasActiveFilters, TData |
| `src/components/Tables/Toolbar/ToolbarViewOptions.tsx` | ToolbarViewOptions, TData |
| `src/components/Tabs/ProjectTabs/BoardTab.tsx` | BoardTab |
| `src/components/Tabs/ProjectTabs/ListTab.tsx` | setIsTaskSheetOpen, ListTab, parentId, isTaskSheetOpen, onAddItem, ... |
| `src/components/Tabs/ProjectTabs/OverviewTab.tsx` | completionPercentage, OverviewTab, teamMembers, upcomingMilestone, managers, ... |
| `src/components/Tabs/ProjectTabs/TableTab.tsx` | taskTree, rowSelection, mutateTask, deleteTask, setRowSelection, ... |
| `src/components/Tabs/ProjectTabs/TimelineTab.tsx` | handleMoveFeature, setSelectedMilestone, tasks, handleViewFeature, marker, ... |
| `src/components/Tabs/ProjectTabs/helper/ListTabColumns.tsx` | useTaskColumns |
| `src/components/Tabs/SettingTabs/AccountTab.tsx` | AccountTab, AccountTabProps |
| `src/components/Tabs/SettingTabs/helper/InvitationsTabColumns.tsx` | setMenuOpen, menuOpen, useInvitationColumns |
| `src/components/Tabs/SettingTabs/helper/TagTabColumns.tsx` | useTagColumns, menuOpen, setMenuOpen |
| `src/components/Tabs/ViewTaskTabs/CommentTab.tsx` | comments, handleSubmit, setNewComment, CommentTab, newComment, ... |
| `src/components/Tabs/ViewTaskTabs/RelatedWorkTab.tsx` | RelatedWorkTab |
| `src/components/Tabs/ViewTaskTabs/TimelineTab.tsx` | TimelineTab, timelineEvents, TimelineEvent |
| `src/components/Task/CheckboxTaskList.tsx` | SkeletonLoader, toggleTaskCompletion, taskId, setUpdatingTaskId, _setError, ... |
| `src/components/Task/SubTasksGroup.tsx` | SubTasksGroup |
| `src/components/Task/TaskContextContent.tsx` | TaskContextContent, currentURL, TaskContextContentProps, handleCopyLink, handleCopyLink |
| `src/components/Task/TaskTree.tsx` | elements, TaskTree, renderTreeElements, taskTrees, renderTreeElements |
| `src/components/Task/TaskTypeCreate.tsx` | TaskTypeCreate, TaskTypeCreateProps |
| `src/components/Task/ViewTaskSheet.tsx` | projectInfo, users, task, taskSheetTabs, setTab, ... |
| `src/components/Widgets/MinimalistTasksWidget.tsx` | error, MinimalistTasksWidget, upcomingTasks, taskId, setUpdatingTaskId, ... |
| `src/components/Widgets/MyTasksWidget.tsx` | MyTasksWidget, MyTasksProps, task, setExpanded, overdueTasks, ... |
| `src/components/Widgets/ProjectsTimelineWidget.tsx` | selectedProject, today, selectedProjectId, getPosition, StatBox, ... |
| `src/components/Widgets/RecentProjectsWidget.tsx` | recentProjectIds, setRecentProjectIds, RecentProjectsWidget |
| `src/components/auth/ContactForm.tsx` | isPending, onSubmit, onSubmit, form, ContactForm, ... |
| `src/components/data-table/data-table.tsx` | DataTable, TData |
| `src/components/ui/action-bar.tsx` | T, startIndex, wrapArray, array |
| `src/components/ui/badge.tsx` | badgeVariants, Badge |
| `src/components/ui/centering.tsx` | CenteringProps, Centering |
| `src/components/ui/chart.tsx` | ChartStyle, colorConfig |
| `src/components/ui/color-picker.tsx` | context, ColorPickerFormatSelectProps, store, onFormatChange, disabled, ... |
| `src/components/ui/form.tsx` | FormField, Form, TName, TFieldValues |
| `src/components/ui/mask-input.tsx` | zipCode.transform, value, finalResult, macAddress.transform, value, ... |
| `src/components/ui/time-picker.tsx` | sortNodes, items, T |
| `src/lib/createTree.tsx` | item, key, T, buildTree, createTree, ... |
| `src/lib/data-grid.ts` | Comp, props, flexRender, TProps |
| `src/lib/data-table.ts` | isLastLeftPinnedColumn, getColumnPinningStyle, isFirstRightPinnedColumn, isPinned, TData |
| `src/lib/utils.ts` | capitalizeWord, classes, capitalizeWord, getColorByTaskStatusType, input, ... |
| `src/modules/pm/projects/components/CreateProjectForm.tsx` | milestoneListEmpty, milestoneFields, newMilestone, handleAddMember, addTeam, ... |
| `src/modules/pm/projects/components/EditProjectForm.tsx` | addTeamMutation, createMilestoneMutation, form, can, setNewMilestone, ... |
| `src/modules/pm/projects/components/ProjectForm.tsx` | pendingRoleId, handleAddMember, availableTeams, availableMembers, ProjectFormProps, ... |
| `src/modules/pm/projects/projects.helpers.ts` | project, getDaysRemaining, calculateProjectProgress, endDate, today, ... |
| `src/modules/pm/projects/projects.types.ts` | CreateProjectCommand |
| `src/modules/pm/tasks/components/TaskTypeHelpers.ts` | isTaskTypeContainer, type |
| `src/modules/pm/tasks/tasks.api.ts` | taskId, payload, data, projectId, updateTaskFn |
| `src/modules/pm/tasks/tasks.hooks.ts` | qc, update.useMutation |
| `src/modules/shared/components/Background/GridDecoration.tsx` | GridDecoration |
| `src/modules/shared/components/Footer/Footer.tsx` | Footer, currentYear |
| `src/modules/shared/components/Footer/ModernPublicFooter.tsx` | ModernPublicFooter, currentYear |
| `src/modules/shared/components/ReturnLink.tsx` | ReturnLink |
| `src/modules/shared/hooks/utils/useEditableColumns.ts` | value, field, rowData, handleFieldUpdate |
| `src/modules/shared/hooks/utils/useLocalStorage.ts` | value, defaultValue, useLocalStorage, T, setValue, ... |
| `src/modules/tenant/iam/PermissionContext.tsx` | escaped, usePermissions, regexStr, pattern, matchPattern, ... |
| `src/modules/tenant/iam/components/EffectBadge.tsx` | EffectBadge |
| `src/modules/tenant/iam/components/MemberAccessTab.tsx` | isFixed, members, isLoading, updateMember, MemberRoleRow, ... |
| `src/modules/tenant/iam/components/PermissionAccordion.tsx` | group, group, isWildcard, action, EffectToggle, ... |
| `src/modules/tenant/iam/iam.types.ts` | StatementDraft |
| `src/modules/tenant/iam/policy/components/PolicyForm.tsx` | handleToggle, current, resourcePattern, availablePermissions, startTransition, ... |
| `src/modules/tenant/iam/policy/components/PolicyRow.tsx` | resourceGroups, PolicyRow |
| `src/modules/tenant/iam/policy/policy.types.ts` | Effect, PermissionGroupResponse |
| `src/modules/tenant/iam/roles/components/RoleForm.tsx` | PolicyRow |
| `src/types/types.ts` | AppMenuItem |

## Entry Points

- `src/modules/pm/projects/components/ProjectForm.tsx::ProjectForm`
- `src/components/Kanban/KanbanBoard.tsx::KanbanBoard`
- `src/modules/pm/projects/components/EditProjectForm.tsx::EditProjectForm`
- `src/modules/pm/projects/components/CreateProjectForm.tsx::CreateProjectForm`
- `src/components/Tabs/ProjectTabs/ListTab.tsx::ListTab`

## Connected Communities

- **components/ui +15 dirs** (59 cross-edges)
- **components/ui +23 dirs** (50 cross-edges)
- **components/ui +11 dirs** (19 cross-edges)
- **. +9 dirs** (16 cross-edges)
- **components/Skeletons +17 dirs** (15 cross-edges)
- **. +2 dirs · currency.transform** (6 cross-edges)
- **. +1 dirs · ColorPickerImpl** (5 cross-edges)
- **components/ui +3 dirs** (4 cross-edges)
- **modules · workflowKeys.root** (4 cross-edges)
- **Tabs/SettingTabs +2 dirs** (2 cross-edges)
- **projects/workflow +20 dirs** (2 cross-edges)
- **task/domain** (2 cross-edges)
- **components · getState** (2 cross-edges)
- **. +1 dirs · findParent** (1 cross-edges)
- **modules · optimisticList** (1 cross-edges)
- **[tenantId]/settings · useSettingsContext** (1 cross-edges)
- **components/Kanban +1 dirs** (1 cross-edges)
- **features/comments +1 dirs** (1 cross-edges)
- **. +1 dirs · useDropzone** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **Calendar/event-components +4 dirs** (1 cross-edges)
- **features/comments** (1 cross-edges)
- **. +2 dirs · BFSSearch** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-32"
smart_context with task: "understand components/ui +97 dirs", format: "gcx"
find_usages with id: "src/modules/pm/projects/components/ProjectForm.tsx::ProjectForm", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
