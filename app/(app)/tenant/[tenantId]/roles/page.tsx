'use client'

import PageHeader from '@src/components/PageHeader'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Input } from '@ui/input'
import { Label } from '@ui/label'
import { Separator } from '@ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { Textarea } from '@ui/textarea'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'

// ---------------------------------------------------------------------------
// Placeholder data — replace with real API calls when the IAM data layer ships
// ---------------------------------------------------------------------------

type PolicyEffect = 'ALLOW' | 'DENY'

type Policy = {
  id: string
  name: string
  description: string
  effect: PolicyEffect
  resource: string
  actions: string[]
}

type Role = {
  id: string
  name: string
  description: string
  isSystem: boolean
  userCount: number
  policies: Policy[]
  createdAt: string
}

const PLACEHOLDER_POLICIES: Policy[] = [
  {
    id: 'p1',
    name: 'organization:read',
    description: 'Read access to all organization resources',
    effect: 'ALLOW',
    resource: 'organization/*',
    actions: ['read', 'list'],
  },
  {
    id: 'p2',
    name: 'organization:write',
    description: 'Full write access to organization resources',
    effect: 'ALLOW',
    resource: 'organization/*',
    actions: ['create', 'update', 'delete'],
  },
  {
    id: 'p3',
    name: 'project:manage',
    description: 'Manage projects within an organization',
    effect: 'ALLOW',
    resource: 'project/*',
    actions: ['create', 'update', 'delete', 'read'],
  },
  {
    id: 'p4',
    name: 'billing:read',
    description: 'View billing and subscription information',
    effect: 'ALLOW',
    resource: 'billing/*',
    actions: ['read', 'list'],
  },
  {
    id: 'p5',
    name: 'member:invite',
    description: 'Invite new members to the tenant',
    effect: 'ALLOW',
    resource: 'member/*',
    actions: ['create', 'invite'],
  },
  {
    id: 'p6',
    name: 'settings:deny',
    description: 'Explicitly deny access to tenant settings',
    effect: 'DENY',
    resource: 'settings/*',
    actions: ['*'],
  },
]

const PLACEHOLDER_ROLES: Role[] = [
  {
    id: 'r1',
    name: 'OWNER',
    description: 'Full unrestricted access to the entire tenant',
    isSystem: true,
    userCount: 1,
    policies: PLACEHOLDER_POLICIES,
    createdAt: '2024-01-01',
  },
  {
    id: 'r2',
    name: 'ADMIN',
    description: 'Administrative access, excluding billing and settings',
    isSystem: true,
    userCount: 3,
    policies: PLACEHOLDER_POLICIES.slice(0, 4),
    createdAt: '2024-01-01',
  },
  {
    id: 'r3',
    name: 'MEMBER',
    description: 'Standard member with read and project access',
    isSystem: true,
    userCount: 12,
    policies: [PLACEHOLDER_POLICIES[0], PLACEHOLDER_POLICIES[2]],
    createdAt: '2024-01-01',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const EffectBadge = ({ effect }: { effect: PolicyEffect }) =>
  effect === 'ALLOW' ? (
    <Badge
      variant="outline"
      className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 gap-1 text-[11px]"
    >
      <CheckCircle2 className="w-3 h-3" />
      Allow
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400 gap-1 text-[11px]"
    >
      <XCircle className="w-3 h-3" />
      Deny
    </Badge>
  )

const PolicyRow = ({ policy }: { policy: Policy }) => (
  <div className="flex items-start gap-4 py-3 px-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 group transition-colors">
    <div className="flex-shrink-0 mt-0.5">
      <EffectBadge effect={policy.effect} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200">
          {policy.name}
        </p>
      </div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
        {policy.description}
      </p>
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-[11px] text-neutral-400 font-mono">
          {policy.resource}
        </span>
        <span className="text-[11px] text-neutral-300 dark:text-neutral-600">
          ·
        </span>
        <div className="flex gap-1">
          {policy.actions.map((action) => (
            <Badge
              key={action}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 font-mono"
            >
              {action}
            </Badge>
          ))}
        </div>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </div>
)

const RoleCard = ({ role }: { role: Role }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Role header */}
      <button
        type="button"
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors group text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <ChevronRight
          className={`w-4 h-4 flex-shrink-0 text-neutral-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold font-mono">
                {role.name}
              </span>
              {role.isSystem && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  system
                </Badge>
              )}
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
              {role.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
            <FileText className="w-3.5 h-3.5" />
            <span>{role.policies.length} policies</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
            <Users className="w-3.5 h-3.5" />
            <span>{role.userCount} users</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem disabled={role.isSystem}>
                <FileText className="mr-2 h-3.5 w-3.5" />
                Attach Policy
              </DropdownMenuItem>
              <DropdownMenuItem disabled={role.isSystem}>
                <Users className="mr-2 h-3.5 w-3.5" />
                Assign to User
              </DropdownMenuItem>
              {!role.isSystem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete Role
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </button>

      {/* Expanded policies */}
      {expanded && (
        <>
          <Separator />
          <div className="px-2 py-2 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                Attached Policies
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={role.isSystem}
              >
                <Plus className="w-3 h-3 mr-1" />
                Attach
              </Button>
            </div>
            {role.policies.length > 0 ? (
              role.policies.map((policy) => (
                <PolicyRow key={policy.id} policy={policy} />
              ))
            ) : (
              <div className="py-6 text-center text-xs text-neutral-400">
                No policies attached to this role.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Create Role Dialog
// ---------------------------------------------------------------------------
const CreateRoleDialog = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Define a new tenant-level role. You can attach policies after
            creation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Role name</Label>
            <Input
              id="role-name"
              placeholder="e.g. DEVELOPER, CLIENT, CONTRACTOR"
              className="font-mono"
            />
            <p className="text-[11px] text-neutral-400">
              Use uppercase, no spaces. This name is used in code references.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Description</Label>
            <Textarea
              id="role-desc"
              placeholder="Briefly describe what this role can do..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => setOpen(false)}>
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const RolesPage = () => {
  const [roleSearch, setRoleSearch] = useState('')
  const [policySearch, setPolicySearch] = useState('')

  const filteredRoles = PLACEHOLDER_ROLES.filter(
    (r) =>
      r.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(roleSearch.toLowerCase()),
  )

  const filteredPolicies = PLACEHOLDER_POLICIES.filter(
    (p) =>
      p.name.toLowerCase().includes(policySearch.toLowerCase()) ||
      p.description.toLowerCase().includes(policySearch.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Roles & Policies"
        icon={Shield}
        description="Identity & Access Management"
      />

      <div className="flex-1 px-6 md:px-10 py-6">
        {/* IAM info banner */}
        <div className="flex items-start gap-3 mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              IAM scaffolding
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-0.5">
              Roles and policies displayed below are placeholders. The data
              layer is being built — this interface will be wired up
              incrementally.
            </p>
          </div>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="h-9">
            <TabsTrigger value="roles" className="text-xs gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Roles
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 ml-1"
              >
                {PLACEHOLDER_ROLES.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="policies" className="text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Policies
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 ml-1"
              >
                {PLACEHOLDER_POLICIES.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── Roles tab ── */}
          <TabsContent value="roles" className="space-y-4 mt-0">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <Input
                  placeholder="Search roles..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <CreateRoleDialog />
            </div>

            <div className="space-y-2">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Shield className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-3" />
                  <p className="text-sm font-medium text-neutral-500">
                    No roles found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Policies tab ── */}
          <TabsContent value="policies" className="space-y-4 mt-0">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <Input
                  placeholder="Search policies..."
                  value={policySearch}
                  onChange={(e) => setPolicySearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <Button variant="default" size="sm" disabled>
                <Plus className="w-4 h-4 mr-1" />
                New Policy
              </Button>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_2fr_80px_160px] items-center gap-4 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                  Policy
                </span>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                  Resource · Actions
                </span>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                  Effect
                </span>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                  Description
                </span>
              </div>

              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy, idx) => (
                  <div
                    key={policy.id}
                    className={`grid grid-cols-[1fr_2fr_80px_160px] items-start gap-4 px-4 py-3 group hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors ${
                      idx < filteredPolicies.length - 1
                        ? 'border-b border-border/60'
                        : ''
                    }`}
                  >
                    <span className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {policy.name}
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-xs font-mono text-neutral-500 truncate">
                        {policy.resource}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {policy.actions.map((a) => (
                          <Badge
                            key={a}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4 font-mono"
                          >
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <EffectBadge effect={policy.effect} />
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
                      {policy.description}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No policies found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default RolesPage
