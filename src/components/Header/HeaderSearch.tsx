// src/components/Header/HeaderSearch.tsx
import { Input } from '@ui/input'
import { Command, Search } from 'lucide-react'

const HeaderSearch = () => (
  <div className="flex-1 max-w-sm hidden lg:block">
    <div className="group relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder="System search..."
        className="h-8 w-full pl-9 pr-10 bg-neutral-100/50 dark:bg-neutral-900/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-black focus-visible:border-neutral-200 dark:focus-visible:border-neutral-800 focus-visible:ring-0 text-[11px] font-medium rounded-lg transition-all"
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black pointer-events-none opacity-50">
        <Command className="size-2" />
        <span className="text-[8px] font-bold">K</span>
      </div>
    </div>
  </div>
)

export default HeaderSearch
