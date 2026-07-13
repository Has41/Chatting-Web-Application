import { sharedFileFilters } from "@chat/attachments/utils/sharedFiles"
import type { SharedFileFilter, SharedFileFilterCounts } from "@chat/attachments/types/sharedFiles"

interface SharedFileFiltersProps {
  activeFilter: SharedFileFilter
  filterCounts: SharedFileFilterCounts
  onFilterChange: (filter: SharedFileFilter) => void
}

const SharedFileFilters = ({ activeFilter, filterCounts, onFilterChange }: SharedFileFiltersProps) => (
  <div className="mb-3 flex gap-1 rounded-md bg-slate-100 p-1">
    {sharedFileFilters.map((filter) => (
      <button
        key={filter.key}
        type="button"
        onClick={() => onFilterChange(filter.key)}
        className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded px-2 py-1.5 text-xs font-semibold transition ${
          activeFilter === filter.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        <span className="truncate">{filter.label}</span>
        <span className="text-[0.65rem] font-medium opacity-70">{filterCounts[filter.key]}</span>
      </button>
    ))}
  </div>
)

export default SharedFileFilters
