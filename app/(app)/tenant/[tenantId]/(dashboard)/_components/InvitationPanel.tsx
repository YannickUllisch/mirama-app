// app/(app)/tenant/[tenantId]/(dashboard)/_components/InvitationPanel.tsx
'use client'

import apiRequest from '@hooks'
import type { InvitationResponse } from '@src/modules/tenant/organization/invitations/invitations.types'
import { Button } from '@ui/button'
import { Skeleton } from '@ui/skeleton'
import {
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { DateTime } from 'luxon'

const InvitationPanelSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="px-5 py-3.5 border-b border-border flex items-center gap-2.5">
      <Skeleton className="h-2.5 w-2.5 rounded-full" />
      <Skeleton className="h-4 w-36" />
    </div>
    <div className="divide-y divide-border">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="px-5 py-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const InvitationRow = ({ invitation }: { invitation: InvitationResponse }) => {
  const accept = apiRequest.invitation.accept.useMutation()
  const decline = apiRequest.invitation.decline.useMutation()
  const isPending = accept.isPending || decline.isPending

  const expiresAt = DateTime.fromJSDate(new Date(invitation.expiresAt))
  const hoursLeft = Math.floor(expiresAt.diffNow('hours').hours)
  const isExpiringSoon = hoursLeft < 12 && hoursLeft > 0
  const isExpired = hoursLeft <= 0

  return (
    <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-muted/60 border border-border flex items-center justify-center shrink-0">
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {invitation.organizationName}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              {invitation.email}
            </span>
            {invitation.iamRoleId && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3 shrink-0" />
                {invitation.iamRoleId}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                isExpired
                  ? 'text-destructive'
                  : isExpiringSoon
                    ? 'text-[#FFAB00]'
                    : 'text-muted-foreground'
              }`}
            >
              <Clock className="h-3 w-3 shrink-0" />
              {isExpired
                ? 'Expired'
                : isExpiringSoon
                  ? `Expires in ${hoursLeft}h`
                  : `Expires ${expiresAt.toRelative()}`}
            </span>
          </div>
        </div>
      </div>

      {!isExpired && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => decline.mutate(invitation.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          >
            <XCircle className="h-3.5 w-3.5" />
            Decline
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isPending}
            onClick={() => accept.mutate(invitation.id)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {accept.isPending ? 'Accepting…' : 'Accept'}
          </Button>
        </div>
      )}

      {isExpired && (
        <span className="text-xs text-muted-foreground/60 shrink-0">
          Expired
        </span>
      )}
    </div>
  )
}

const InvitationPanel = () => {
  const {
    items: invitations,
    isLoading,
    isError,
  } = apiRequest.invitation.fetchMine.useQuery()

  if (isLoading) return <InvitationPanelSkeleton />
  if (isError || invitations.length === 0) return null

  const activeInvitations = invitations.filter(
    (inv) =>
      DateTime.fromJSDate(new Date(inv.expiresAt)).diffNow('hours').hours > 0,
  )

  if (activeInvitations.length === 0) return null

  return (
    <div className="rounded-xl border border-lava/20 bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-lava/15 bg-lava/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lava opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lava" />
          </span>
          <h2 className="text-sm font-medium text-foreground">
            Pending invitations
          </h2>
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-lava text-white text-[10px] font-semibold tabular-nums">
            {activeInvitations.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">
          You've been invited to{' '}
          {activeInvitations.length === 1
            ? 'an organization'
            : `${activeInvitations.length} organizations`}
        </p>
      </div>
      <div className="divide-y divide-border">
        {activeInvitations.map((inv) => (
          <InvitationRow key={inv.id} invitation={inv} />
        ))}
      </div>
    </div>
  )
}

export default InvitationPanel
