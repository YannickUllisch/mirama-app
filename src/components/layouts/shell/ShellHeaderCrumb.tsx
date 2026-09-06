import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@src/components/ui/breadcrumb'

interface ShellHeaderCrumbProps {
  label: string
}

const ShellHeaderCrumb = ({ label }: ShellHeaderCrumbProps) => (
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

export default ShellHeaderCrumb
