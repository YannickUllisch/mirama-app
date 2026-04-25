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
  const [isSticky, setIsSticky] = useState<boolean>(true)
  const headerRef = useRef<HTMLTableSectionElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect: DOMRect = headerRef.current.getBoundingClientRect()
        setIsSticky(rect.top <= -3)
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <TableHeader
      ref={headerRef}
      style={{ zIndex: 4 }}
      className={`bg-neutral-50/80 dark:bg-neutral-800/50 backdrop-blur-sm border-b border-border ${
        isSticky ? 'sticky -top-0.75' : ''
      }`}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="headerGroup group hover:bg-transparent"
        >
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="relative text-[10px] font-semibold text-muted-foreground uppercase tracking-widest py-2.5"
              style={{
                width: header.getSize() === 0 ? undefined : header.getSize(),
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              {header.column.getCanResize() && (
                <div className="absolute top-1/2 -translate-y-1/2 right-0 h-4 flex items-center">
                  <GripVertical
                    className="w-3.5 h-3.5 cursor-col-resize text-muted-foreground/30 invisible group-hover:visible transition-opacity"
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    style={{
                      userSelect: 'none',
                      touchAction: 'none',
                    }}
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
