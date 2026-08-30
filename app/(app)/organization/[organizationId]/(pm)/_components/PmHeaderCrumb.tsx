// app/(app)/organization/[organizationId]/(pm)/_components/PmHeaderCrumb.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@src/components/ui/breadcrumb'

interface PmHeaderCrumbProps {
  label: string
}

const PmHeaderCrumb = ({ label }: PmHeaderCrumbProps) => (
  <Breadcrumb>
    <BreadcrumbList className="flex-nowrap">
      <BreadcrumbItem>
        <BreadcrumbPage className="text-sm font-medium text-ink">
          {label}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
)

export default PmHeaderCrumb
