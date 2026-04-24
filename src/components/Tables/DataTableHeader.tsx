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
      className={`bg-warm-white dark:bg-warm-dark/60 border-b border-black/10 dark:border-white/10 ${
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
              // Badge micro-label style: 12px / semibold / +0.125px tracking / uppercase per DESIGN.md
              className="relative text-[12px] font-semibold [letter-spacing:0.125px] text-warm-gray-300 uppercase py-2.5"
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
