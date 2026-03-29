'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import {
  type CreateOrganizationRequest,
  CreateOrganizationSchema,
} from '@server/modules/account/organizations/features/create-organization/schema'
import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@src/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import { Skeleton } from '@src/components/ui/skeleton'
import {
  Building2,
  FolderOpen,
  Loader2,
  MapPin,
  Plus,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

const TenantPage = () => {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: organizations, isLoading } =
    apiRequest.organization.fetchAll.useQuery(session?.user.tenantId ?? '')

  useEffect(() => {
    console.info(organizations)
  }, [organizations])
  const { mutate: createOrganization, isPending } =
    apiRequest.organization.create.useMutation()

  const form = useForm<CreateOrganizationRequest>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  const onSubmit = (data: CreateOrganizationRequest) => {
    createOrganization(
      { tenantId: session?.user.tenantId ?? '', data },
      {
        onSuccess: () => {
          form.reset()
          setDialogOpen(false)
        },
      },
    )
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              Tenant
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Organizations</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage the organizations within your tenant.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" size="default">
              <Plus className="w-4 h-4" />
              New Organization
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to your tenant. Fill in the details
                below.
              </DialogDescription>
            </DialogHeader>

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="94103" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isPending}>
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tenant Info */}
      {session?.user?.tenantId && (
        <div className="mb-6">
          <Badge variant="secondary">Tenant ID: {session.user.tenantId}</Badge>
        </div>
      )}

      {/* Organization List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {organizations.map((org) => (
            <Card
              key={`organization-${org.id}`}
              className="cursor-pointer hover:border-primary/40 transition-all duration-200"
              onClick={async () => {
                const updated = await updateSession({ organizationId: org.id })
                if (updated?.user?.organizationId === org.id) {
                  router.push(`/organization/${org.id}`)
                } else {
                  toast.error('You are not a member of this organization')
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{org.name}</CardTitle>
                  <Badge variant="outline">{org.slug}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {org.city}, {org.state} {org.zipCode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {org._count.members}{' '}
                    {org._count.members === 1 ? 'member' : 'members'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5" />
                    {org._count.projects}{' '}
                    {org._count.projects === 1 ? 'project' : 'projects'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16">
          <Building2 className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-4" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            No organizations yet
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Create your first organization to get started.
          </p>
        </Card>
      )}
    </div>
  )
}

export default TenantPage
