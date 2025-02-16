import type React from 'react'
import type { TableData } from '@src/components/Tables/DataTable'
import { flexRender, type Table } from '@tanstack/react-table'
import { TableHead, TableHeader, TableRow } from '@src/components//ui/table'
import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { APP_HEADER_HEIGHT } from '@src/lib/constants'

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

        setIsSticky(rect.top <= APP_HEADER_HEIGHT - 3)
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
      className={`dark:bg-neutral-900 bg-neutral-50 ${
        isSticky ? `sticky top-[${APP_HEADER_HEIGHT - 3}px]` : ''
      }`}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="headerGroup group">
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className="relative"
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
                  <div className="absolute top-3.5 right-0 h-full">
                    <GripVertical
                      className="cursor-col-resize bg-neutral-800 invisible group-hover:w-5 group-hover:visible transition-all ease-in-out duration-150"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                        height: '30%',
                        userSelect: 'none',
                        justifyContent: 'center',
                        backgroundColor: 'inherit',
                        alignItems: 'center',
                        touchAction: 'none',
                      }}
                    />
                  </div>
                )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}

export default DataTableHeader
