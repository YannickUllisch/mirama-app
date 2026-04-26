import type { TableData } from '@src/components/Tables/DataTable'
import { TableHead, TableHeader, TableRow } from '@src/components/ui/table'
import { type Table, flexRender } from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DataTableContentProps<TData extends TableData<TData>> {
  table: Table<TData>
}

const DataTableHeader = <TData extends TableData<TData>>({
  table,
}: DataTableContentProps<TData>) => {
  const [isSticky, setIsSticky] = useState<boolean>(false)
  const headerRef = useRef<HTMLTableSectionElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect: DOMRect = headerRef.current.getBoundingClientRect()
        setIsSticky(rect.top <= -3)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <TableHeader
      ref={headerRef}
      style={{ zIndex: 4 }}
      className={`bg-background border-b border-border ${isSticky ? 'sticky -top-0.75' : ''}`}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="group border-0 hover:bg-transparent"
        >
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{
                width: header.getSize() === 0 ? undefined : header.getSize(),
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getCanResize() && (
                <div className="absolute top-1/2 -translate-y-1/2 right-0 h-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical
                    className="w-3 h-3 cursor-col-resize text-border hover:text-muted-foreground"
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    style={{ userSelect: 'none', touchAction: 'none' }}
                  />
                </div>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}

export default DataTableHeader
